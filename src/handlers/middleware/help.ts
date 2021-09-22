import { isPrivateChat } from '../../utils/telegramUtils';
import { Context } from 'telegraf';
import { Message } from 'typegram';

const handlePrivate = async (ctx: Context) => {
  await ctx.reply("Here's what I can do: ");
  // TODO: Add better help text
  return ctx.reply(
    '/generate - Create the opt-in button\n' +
      "/list - Show a list of all the groups your buttons were forwarded to and see who's clicked them",
  );
};

const handleGroup = async (ctx: Context) =>
  ctx.reply('Message me directly for more options');

/**
 * Send help message
 */
export const help = async (ctx: Context): Promise<Message.TextMessage> =>
  isPrivateChat(ctx) ? handlePrivate(ctx) : handleGroup(ctx);
