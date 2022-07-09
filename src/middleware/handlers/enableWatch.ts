import { Context } from 'grammy';
import { setChatWatching } from '../../modules/db';
import { getTitle } from '../../utils/getChatTitle';

/**
 * Enables watch mode for the specified group
 * Used through the buttons provided from handlers/watch.js
 *
 * @param ctx
 */
export const enableWatch = async (ctx: Context): Promise<void> => {
  const chatId = Number(ctx.match[1]);
  const chat = await ctx.api.getChat(chatId);

  // TODO: check if we're already watching, and let the user know if we are

  await setChatWatching(chat);

  ctx.answerCallbackQuery();
  ctx.reply(
    `Now watching ${getTitle(chat)}\\. Use \`/lookaway\` to stop\\.

All messages in the chat will be analyzed by the Perspective API\\. Use \`/about\` for more info\\.`,
    {
      parse_mode: 'MarkdownV2',
    },
  );
};
