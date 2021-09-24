import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import { middleware } from './handlers/middleware';
import { help } from './handlers/middleware/help';
import { start } from './handlers/middleware/start';
import { bot } from './modules/bot';
import { init } from './modules/db/mongodb-init';
import { logMessage, logError } from './utils/log';

// If not in the production environment, try to use the URL argument.
// If in production, or if the URL argument is absent, use the environment variable.
const url =
  (process.env.NODE_ENV !== 'production' && process.argv[2]) ||
  process.env.BOT_URL;

if (!url) {
  logMessage('Unable to start without configured URL');
  logMessage('Specify the URL with the BOT_URL environment variable');
  process.exit();
}

bot.start(start);
bot.help(help);

bot.use(middleware);

const hash = crypto
  .createHash('sha256')
  .update(process.env.BOT_TOKEN || '')
  .digest('base64');
bot.telegram.setWebhook(`${url}/${hash}`);

const app = express();
app.use(bot.webhookCallback(`/${hash}`));
app.listen(3000, () => {
  // TODO: stop the app if connection fails
  init();

  logMessage('Bot listening on port 3000!');
});

bot.catch((err) => logError(err as Error));

process.once('SIGINT', () => {
  logMessage('\nStopping...');
  try {
    bot.stop('SIGINT');
  } catch (err) {
    //
  }
});
process.once('SIGTERM', () => {
  logMessage('\nStopping...');
  try {
    bot.stop('SIGTERM');
  } catch (err) {
    //
  }
});
