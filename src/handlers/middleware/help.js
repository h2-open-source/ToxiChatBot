import { isPrivateChat } from '../../utils/telegramUtils';

/**
 * @param { import('telegraf/typings/context').TelegrafContext } ctx.reply
 */
const handlePrivate = ({ reply }) => {
	reply("Here's what I can do: ");
	// TODO: Add better help text
	reply(
		'/generate - Create the opt-in button\n' +
			"/list - Show a list of all the groups your buttons were forwarded to and see who's clicked them"
	);
};

/**
 * @param { import('telegraf/typings/context').TelegrafContext } ctx.reply
 */
const handleGroup = ({ reply }) => {
	reply('Message me directly for more options');
};

/**
 * Send help message
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx
 * @param { Function } next
 */
export const help = async (ctx, next) => {
	if (isPrivateChat(ctx)) {
		await handlePrivate(ctx);
	} else {
		await handleGroup(ctx);
	}

	return next();
};
