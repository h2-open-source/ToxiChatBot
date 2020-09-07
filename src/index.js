// eslint-disable-next-line no-unused-vars
import localenv from 'localenv';
import express from 'express';
import crypto from 'crypto';
import { logMessage, logError } from './utils/log';
import bot from './modules/bot';
import middleware from './handlers/middleware';
import start from './handlers/middleware/start';
import mongoinit from './modules/db/mongodb-init';
import ngrok from 'ngrok';

const buildApp = async (app, bot) => {
  let url = ''; // Put production URL here

  if (app.get('env') === 'development') {
    try {
      url = await ngrok.connect({ port: 3000 })
    } catch (err) {
      logError(err);
    }
  }

  logMessage(url);

  const hash = crypto.createHash('sha256')
    .update(process.env.BOT_TOKEN).digest('base64');
  bot.telegram.setWebhook(`${url}/${hash}`);

  app.use(bot.webhookCallback(`/${hash}`));
  app.listen(3000, () => {
    logMessage('Example app listening on port 3000!');

    mongoinit();
  });

  bot.catch(logError);
}

bot.start(start);
bot.help(({ reply }) => { reply("Here's what I can do: "); });

bot.use(middleware);

const app = express();

(async () => await buildApp(app, bot))();
