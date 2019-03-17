// eslint-disable-next-line no-unused-vars
import localenv from 'localenv';
import Telegraf from 'telegraf';
import express from 'express';
import crypto from 'crypto';
import * as log from './utils/log';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(({ reply }) => reply('Hello!'));
bot.help(({ reply }) => { reply("Here's what I can do: "); });

const hash = crypto.createHash('sha256')
  .update(process.env.BOT_TOKEN).digest('base64');
bot.telegram.setWebhook(`https://355025bc.ngrok.io/${hash}`);

const app = express();
app.use(bot.webhookCallback(`/${hash}`));
app.listen(3000, () => {
  log.logMessage('Example app listening on port 3000!');
});
