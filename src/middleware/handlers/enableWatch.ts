import { Context } from 'grammy';
import { Chat, ChatFromGetChat, Message } from '@grammyjs/types';
import { isUser } from '../../utils/typeGuards';
import { findChatOptins, setChatWatching } from '../../modules/db';
import { getTitle } from '../../utils/getChatTitle';

/**
 * Enables watch mode for the specified group
 *
 * @param ctx
 */
export const enableWatch = async (
  ctx: Context,
): Promise<Message.TextMessage> => {
  const chatId = Number(ctx.match[1]);
  const chat = await ctx.api.getChat(chatId);

  // TODO: check if we're already watching, and let the user know if we are

  await setChatWatching(chat);

  ctx.answerCallbackQuery();
  return ctx.reply(
    `Now watching ${getTitle(chat)}\\. Use \`/lookaway\` to stop\\.

All messages in the chat will be analyzed by the Perspective API\\. Use \`/about\` for more info\\.`,
    {
      parse_mode: 'MarkdownV2',
    },
  );
};
