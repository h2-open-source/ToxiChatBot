import { addUserOptIn } from '../../modules/db';

/**
 * Record that user clicked the opt-in button
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx
 * @param { Function } next
 */
export const optin = async (ctx, next) => {
	const { chat } = ctx;
	const { from } = ctx.callbackQuery;

	await addUserOptIn(chat, from);

	ctx.answerCbQuery('Your response has been recorded', false);

	return next();
};
