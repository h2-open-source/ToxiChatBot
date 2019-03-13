require('localenv');
const Telegraf = require('telegra');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(({ reply }) => reply('Hello!'));
bot.help(({ reply }) => reply('I don\'t work yet.'));
bot.launch();

bot.telegram.setWebhook('https://----.localtunnel.me/secret-path');

const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.use(bot.webhookCallback('/secret-path'));
app.listen(3000, () => {
    console.log('App listening on port 3000');
});