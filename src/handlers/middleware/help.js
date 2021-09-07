import { isPrivateChat } from 'utils/telegramUtils';

/**
 * @param { import('telegraf/typings/context').TelegrafContext } ctx.reply
 */
const handlePrivate = async ({ reply }) => {
  await reply("Here's what I can do: ");
  // TODO: Add better help text
  return reply(
    '/generate - Create the opt-in button\n' +
      "/list - Show a list of all the groups your buttons were forwarded to and see who's clicked them"
  );
};

/**
 * @param { import('telegraf/typings/context').TelegrafContext } ctx.reply
 */
const handleGroup = async ({ reply }) =>
  reply('Message me directly for more options');

/**
 * Send help message
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx
 */
export const help = async (ctx) =>
  isPrivateChat(ctx) ? handlePrivate(ctx) : handleGroup(ctx);
