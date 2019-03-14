require('localenv');
const Telegraf = require('telegraf');
const express = require('express');
const crypto = require('crypto');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(({ reply }) => reply('Hello!'));
bot.help(({ reply }) => reply('I don\'t work yet.'));

const hash = crypto.createHash('sha256')
    .update(process.env.BOT_TOKEN).digest('base64');
console.log(hash);
bot.telegram.setWebhook(`https://948693f0.ngrok.io/${hash}`);

const app = express();
//app.get('/', (req, res) => res.send('Hello World!'));
app.use(bot.webhookCallback(`/${hash}`));
app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});