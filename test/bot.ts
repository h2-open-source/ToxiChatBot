import { Bot } from 'grammy';

export const bot = new Bot(process.env.BOT_TOKEN || "test"); // { username: process.env.BOT_USERNAME, }
