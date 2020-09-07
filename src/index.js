// eslint-disable-next-line no-unused-vars
import localenv from 'localenv';
import express from 'express';
import crypto from 'crypto';
import { logMessage, logError } from './utils/log';
import bot from './modules/bot';
import middleware from './handlers/middleware';
import start from './handlers/middleware/start';
import mongoinit from './modules/db/mongodb-init';

const url = process.argv[2] || process.env.BOT_URL;

bot.start(start);
bot.help(({ reply }) => { reply("Here's what I can do: "); });

bot.use(middleware);

const app = express();

const hash = crypto.createHash('sha256')
  .update(process.env.BOT_TOKEN).digest('base64');
bot.telegram.setWebhook(`${url}/${hash}`);

app.use(bot.webhookCallback(`/${hash}`));
app.listen(3000, () => {
  logMessage('Bot listening on port 3000!');

  // TODO: stop the app if connection fails
  mongoinit();
});

bot.catch(logError);
