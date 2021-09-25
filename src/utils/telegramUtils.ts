import { Context } from 'telegraf';

/**
 * Check if a given Context is from a private message.
 * @param ctx The Telegraf Context to check
 * @returns True if a private message
 */
export const isPrivateChat = (ctx: Context): boolean =>
  ctx.chat.type === 'private';

/**
 * Check if given user is an admin in the context
 * @param ctx The Telegraf Context to check
 * @param userId The Telegram user ID
 * @returns True if the specified user is admin
 */
export const isUserAdmin = async (
  ctx: Context,
  userId: number,
): Promise<boolean> => {
  try {
    const admins = await ctx.getChatAdministrators();
    return admins.some((admin) => admin.user?.id === userId);
  } catch (err) {
    if (err.code === 400) return true;
  }

  return false;
};
