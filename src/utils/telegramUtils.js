/**
 * Check if a given TelegrafContext is from a private message.
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx The Telegraf Context to check
 * @returns { boolean } True if a private message
 */
export const isPrivateChat = (ctx) => ctx.chat.type === 'private';

/**
 * Use a context to determine if a user is an admin in a group
 * @param { import('telegraf/typings/context').TelegrafContext } ctx The Telegraf Context to check
 * @param {Number} chatId The Telegram chat ID
 * @param {Number} userId The Telegram user ID
 */
// TODO: chatId and userId are always present in ctx. Remove those parameters and access them internally here
export const isUserAdmin = async (ctx, chatId, userId) => {
  try {
    const admins = await ctx.getChatAdministrators(chatId);
    return admins.some((admin) => admin.user?.id === userId);
  } catch (err) {
    if (err.code === 400) return true;
  }

  return false;
};
