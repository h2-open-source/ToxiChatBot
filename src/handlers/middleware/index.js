import { Extra, Composer } from 'telegraf';

import addedToGroup from './addedToGroup';
import { isPrivateChat } from '../../utils/telegramUtils';
import { addUserOptIn } from '../../modules/db';

const composer = new Composer();

composer.on('new_chat_members', addedToGroup);

composer.command('generate', async (ctx, next) => {
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

    // TODO: Provide some way to get the ID of the optin message, so admin can see who clicked which button (in case multiple separate buttons are sent)

    return next();
});

composer.action('optin', async (ctx, next) => {
    const { chat } = ctx;
    const { from } = ctx.callbackQuery;

    await addUserOptIn(chat, from);

    ctx.answerCbQuery('Your response has been recorded', false);

    return next();
});

export default composer;
