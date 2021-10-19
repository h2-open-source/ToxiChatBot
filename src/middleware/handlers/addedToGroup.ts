import { Context } from 'grammy';
import { Message } from '@grammyjs/types';

/**
 * Send an introduction when the bot is added to a group.
 *
 * @param ctx
 */
export const addedToGroup = async (
  ctx: Context,
): Promise<Message.TextMessage> =>
  ctx.reply(`Hi there, I'm ${process.env.BOT_NAME}`);
