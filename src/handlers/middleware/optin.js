import { addUserOptIn } from '../../modules/db';

export default async (ctx, next) => {
    const { chat } = ctx;
    const { from } = ctx.callbackQuery;

    await addUserOptIn(chat, from);

    ctx.answerCbQuery('Your response has been recorded', false);

    return next();
};
