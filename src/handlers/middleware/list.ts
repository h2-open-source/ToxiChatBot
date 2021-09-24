import { Context, Markup } from 'telegraf';
import { Chat, ChatFromGetChat, Message } from 'typegram';
import { findChatsForUser } from '../../modules/db';
import { isPrivateChat } from '../../utils/telegramUtils';

/**
 * Responds to user request for a list of groups to which they've sent opt-in buttons.
 *
 * Provides a list of buttons, one for each group this user has created an opt-in button,
 * each of which the use can click to view the list of users who have clicked the opt-in
 * button in that group.
 *
 * @param ctx
 */
export const listHandler = async (
  ctx: Context,
): Promise<Message.TextMessage> => {
  if (!isPrivateChat(ctx)) {
    return ctx.reply('Try this command in a private chat with me.');
  }

  const chats = await findChatsForUser(ctx.from);

  if (chats.length < 1) {
    return ctx.reply(
      'You have no groups set up yet. Try calling /start in your group.',
    );
  }

  const chatsDetails = await Promise.all(
    chats.map((c) => ctx.telegram.getChat(c.id)),
  );

  const hasTitle = (chat: unknown): chat is Chat.TitleChat =>
    'title' in (chat as Chat.TitleChat);
  const getTitle = (chat: ChatFromGetChat) =>
    hasTitle(chat) ? chat.title : chat.username;

  return ctx.reply(
    'Choose a group below to see a list of users that clicked the button in that group.',
    Markup.inlineKeyboard(
      chatsDetails.map((c) =>
        Markup.button.callback(getTitle(c), `list-${c.id}`),
      ),
    ),
  );
};
