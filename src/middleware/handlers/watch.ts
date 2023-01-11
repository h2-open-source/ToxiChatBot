import { Context, InlineKeyboard } from 'grammy';
import { isPrivateChat, isUserAdmin } from '../../utils/telegramUtils';
import { getUserChatsUnwatched, setChatWatching } from '../../modules/db';
import { getTitle } from '../../utils/getChatTitle';

/**
 * In groups, start watching the group.
 * In a Private Chat, provide a list of unwatched chats for the user to enable watch mode
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

    const { chat } = ctx;

    const watchResult = await setChatWatching(chat.id);

    if (!watchResult) {
      ctx.reply(
        `I'm not running in this group yet. Try running /start in the group you want to watch.`,
      );
      return;
    }

    ctx.reply(
      `Now watching ${getTitle(chat)}. Use /lookaway to stop.

All messages in the chat will be analyzed by the Perspective API. Use /about for more info.`,
    );

    return;
  }

  const chats = await getUserChatsUnwatched(user);

  if (chats.length < 1) {
    ctx.reply(
      `I'm not running in any of your chats yet. Try running /start in the group you want to watch.`,
    );
    return;
  }

  const chatsDetails = await Promise.all(
    chats.map((c) => ctx.api.getChat(c.id)),
  );

  ctx.reply(
    `Choose a chat to watch.

To stop watching a chat, use /lookaway`,
    {
      reply_markup: chatsDetails.reduce(
        (keyboard, chat) => keyboard.text(getTitle(chat), `watch-${chat.id}`),
        new InlineKeyboard(),
      ),
    },
  );
};
