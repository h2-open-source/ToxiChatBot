import { Context } from 'telegraf';

/**
 * Check if a given TelegrafContext is from a private message.
 *
 * @param ctx The Telegraf Context to check
 * @returns True if a private message
 */
export const isPrivateChat = (ctx: Context) => ctx.chat.type === 'private';

/**
 * Use a context to determine if a user is an admin in a group
 * @param ctx The Telegraf Context to check
 * @param userId The Telegram user ID
 */
export const isUserAdmin = async (ctx: Context, userId: number) => {
  try {
    const admins = await ctx.getChatAdministrators();
    return admins.some((admin) => admin.user?.id === userId);
  } catch (err) {
    if (err.code === 400) return true;
  }

  return false;
};
