import { Context, InlineKeyboard } from 'grammy';
import { ChatFromGetChat } from '@grammyjs/types';
import { findChatsForUser } from '../../modules/db';
import { isPrivateChat } from '../../utils/telegramUtils';
import { hasTitle } from '../../utils/typeGuards';

/**
 * Responds to user request for a list of groups to which they've sent opt-in buttons.
 *
 * Provides a list of buttons, one for each group this user has created an opt-in button,
 * each of which the use can click to view the list of users who have clicked the opt-in
 * button in that group.
 *
 * @param ctx
 */
export const listHandler = async (ctx: Context): Promise<void> => {
  if (!isPrivateChat(ctx)) {
    ctx.reply('Try this command in a private chat with me.');
  } else {
    const chatsResult = await findChatsForUser(ctx.from);

    chatsResult
      .asyncMap(async (chats) => {
        if (chats.length < 1) {
          ctx.reply(
            'You have no groups set up yet. Try calling /start in your group.',
          );
        } else {
          const chatsDetails = await Promise.all(
            chats.map((c) => ctx.api.getChat(c.id)),
          );

          const getTitle = (chat: ChatFromGetChat) =>
            hasTitle(chat) ? chat.title : chat.username;

          ctx.reply(
            'Choose a group below to see a list of users that clicked the button in that group.',
            {
              reply_markup: chatsDetails.reduce(
                (keyboard, chat) =>
                  keyboard.text(getTitle(chat), `list-${chat.id}`),
                new InlineKeyboard(),
              ),
            },
          );
        }
      })
      .mapErr(() => {
        ctx.reply('Sorry, and unknown error ocurred. Please try again later.');
      });
  }
};
