// eslint-disable-next-line no-unused-vars
import localenv from 'localenv';
import express from 'express';
import crypto from 'crypto';
import logError, * as log from './utils/log';
import bot from './modules/bot';
import middleware from './handlers/middleware';
import start from './handlers/middleware/start';
import mongoinit from './modules/db/mongodb-init';

mongoinit();

bot.start(start);
bot.help(({ reply }) => { reply("Here's what I can do: "); });

bot.use(middleware);

const hash = crypto.createHash('sha256')
  .update(process.env.BOT_TOKEN).digest('base64');
bot.telegram.setWebhook(`https://4c1e6aeee946.ngrok.io/${hash}`);

const app = express();
app.use(bot.webhookCallback(`/${hash}`));
app.listen(3000, () => {
  log.logMessage('Example app listening on port 3000!');
});

bot.catch(logError);
