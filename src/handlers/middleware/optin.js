import { addUserOptIn } from '../../modules/db';

/**
 * Record that user clicked the opt-in button
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx
 */
export const optin = async (ctx) => {
  const { chat } = ctx;
  const { from } = ctx.callbackQuery;

  await addUserOptIn(chat, from);

  return ctx.answerCbQuery('Your response has been recorded', false);
};
