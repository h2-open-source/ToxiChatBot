import Telegraf from 'telegraf';

export const bot = new Telegraf(process.env.BOT_TOKEN, {
  username: process.env.BOT_USERNAME,
});
