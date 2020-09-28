import Telegraf from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN, {
    username: process.env.BOT_USERNAME,
});

export default bot;
