import { Context } from 'telegraf';
import { Message } from 'typegram';

/**
 * Send an introduction when the bot is added to a group.
 *
 * @param ctx
 */
export const addedToGroup = async (ctx: Context) => {
  const { message } = ctx;
  const { username } = await ctx.telegram.getMe();

  const botWasAdded =
    'new_chat_members' in message &&
    message.new_chat_members?.some((user) => user.username === username);

  return botWasAdded
    ? ctx.reply(`Hi there, I'm ${process.env.BOT_NAME}`)
    : null;
};
