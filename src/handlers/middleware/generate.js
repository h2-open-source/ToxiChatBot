import { Extra } from 'telegraf';
import { isPrivateChat } from '../../utils/telegramUtils';

export default async (ctx, next) => {
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
};
