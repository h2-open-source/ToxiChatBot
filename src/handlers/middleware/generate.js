import { Extra } from 'telegraf';
import { isPrivateChat, isUserAdmin } from '../../utils/telegramUtils';

/**
 * Create an "opt-in" message.
 *
 * Creates a message with a button for users to express their desire to stay in the group.
 * If sent in a direct message to the bot, the user will be instructed to forward the
 * generated message to the group they want to track.
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx
 */
export const generate = async (ctx) => {
  if (!(await isUserAdmin(ctx, ctx.chat.id, ctx.from.id))) {
    return ctx.reply('Only admins can use this bot.');
  }

  if (isPrivateChat(ctx)) {
    return ctx.reply(
      'Forward the following message to your group, or re-run this command in the group.'
    );
  }

  return ctx.reply(
    'Do you want to stay in this group? Click this button.',
    Extra.HTML().markup((m) =>
      m.inlineKeyboard([m.callbackButton('I want to stay!', 'optin')])
    )
  );
};
