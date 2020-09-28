import { logMessage } from './log';

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
export const isUserAdmin = async (ctx, chatId, userId) => {
    const admins = await ctx.getChatAdministrators(chatId);
    return admins.some((admin) => admin.user.id === userId);
};

export default {
    isPrivateChat,
    isUserAdmin,
};
