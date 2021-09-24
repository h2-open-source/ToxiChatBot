import { Context } from 'telegraf';
import { addUserOptIn } from '../../modules/db';

/**
 * Record that user clicked the opt-in button
 *
 * @param ctx
 */
export const optin = async (ctx: Context): Promise<true> => {
  const { chat } = ctx;
  const { from } = ctx.callbackQuery;

  await addUserOptIn(chat, from);

  return ctx.answerCbQuery('Your response has been recorded', {
    show_alert: false,
  });
};
