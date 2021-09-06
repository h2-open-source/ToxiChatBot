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
 * @param { Function } next
 */
export default async (ctx, next) => {
    if (!(await isUserAdmin(ctx, ctx.chat.id, ctx.from.id))) {
        ctx.reply('Only admins can use this bot.');
        return next();
    }

    if (isPrivateChat(ctx)) {
        ctx.reply(
            'Forward the following message to your group, or re-run this command in the group.'
        );
    }

    ctx.reply(
        'Do you want to stay in this group? Click this button.',
        Extra.HTML().markup((m) =>
            m.inlineKeyboard([m.callbackButton('I want to stay!', 'optin')])
        )
    );

    return next();
};
