import { Extra } from 'telegraf';
import { findChatsForUser } from '../../modules/db';

/**
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx
 * @param { Function } next
 */
const listHandler = async (ctx, next) => {
    // Get Chats for user
    const chats = await findChatsForUser(ctx.from);
    const getChats = chats.map((c) => ctx.telegram.getChat(c.id));
    const chatsDetails = await Promise.all(getChats);

    ctx.reply(
        'Choose a group below to see a list of users that clicked the button in that group.',
        Extra.HTML().markup((m) =>
            m.inlineKeyboard(
                chatsDetails.map((c) =>
                    m.callbackButton(`${c.title}`, `list-${c.id}`)
                )
            )
        )
    );

    return next();
};

export default listHandler;
