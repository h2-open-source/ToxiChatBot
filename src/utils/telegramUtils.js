/**
 * Check if a given TelegrafContext is from a private message.
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx The Telegraf Context to check
 * @returns { boolean } True if a private message
 */
export const isPrivateChat = (ctx) => ctx.chat.type === 'private';

export default {
    isPrivateChat,
};
