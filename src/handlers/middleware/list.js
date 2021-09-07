import { Extra } from 'telegraf';
import { findChatsForUser } from '../../modules/db';
import { isPrivateChat } from '../../utils/telegramUtils';

/**
 * Responds to user request for a list of groups to which they've sent opt-in buttons.
 *
 * Provides a list of buttons, one for each group this user has created an opt-in button,
 * each of which the use can click to view the list of users who have clicked the opt-in
 * button in that group.
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx
 * @param { Function } next
 */
export const listHandler = async (ctx, next) => {
	if (!isPrivateChat(ctx)) {
		ctx.reply('Try this command in a private chat with me.');
		return next();
	}

	// Get Chats for user
	const chats = await findChatsForUser(ctx.from);

	if (chats.length < 1) {
		ctx.reply(
			'You have no groups set up yet. Try calling /start in your group.'
		);
		return next();
	}

	const getChats = chats.map((c) => ctx.telegram.getChat(c.id));
	const chatsDetails = await Promise.all(getChats);

	ctx.reply(
		'Choose a group below to see a list of users that clicked the button in that group.',
		Extra.HTML().markup((m) =>
			m.inlineKeyboard(
				chatsDetails.map((c) => m.callbackButton(`${c.title}`, `list-${c.id}`))
			)
		)
	);

	return next();
};
