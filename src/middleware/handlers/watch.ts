import { Context, InlineKeyboard } from 'grammy';
import { isPrivateChat, isUserAdmin } from '../../utils/telegramUtils';
import { getUserChatsUnwatched } from '../../modules/db';
import { getTitle } from '../../utils/getChatTitle';

/**
 * Provide list of unwatched chats for the user to enable watch mode
 *
 * @param ctx
 */
export const watch = async (ctx: Context): Promise<void> => {
  const user = ctx.from;

  if (!isPrivateChat(ctx)) {
    if (!(await isUserAdmin(ctx, user.id))) {
      ctx.reply('Only admins can use this feature.');
      return;
    }

    // TODO: watch this chat
    return;
  }

  const chats = await getUserChatsUnwatched(user);

  const chatsDetails = await Promise.all(
    chats.map((c) => ctx.api.getChat(c.id)),
  );

  ctx.reply(
    `Choose a chat to watch\\.

To stop watching a chat, use \`/lookaway\``,
    {
      parse_mode: 'MarkdownV2',
      reply_markup: chatsDetails.reduce(
        (keyboard, chat) => keyboard.text(getTitle(chat), `watch-${chat.id}`),
        new InlineKeyboard(),
      ),
    },
  );
};
