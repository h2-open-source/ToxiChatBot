import { findUser, addUser, addChat } from '../../modules/db/index';
import { logMessage } from '../../utils/log';

export default async (ctx) => {
    // Record user only if in DM.
    if (ctx.chat.type === 'private') {
        await handlePrivateStart(ctx);
    } else {
        await handleGroupStart(ctx);
    }

    // Now user can send a command to see all their groups, see list of opted-in users for each, and generate button for that group
};

/**
 *  Persist the user and let them know how to proceed.
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx
 */
const handlePrivateStart = async (ctx) => {
    await addUser(ctx.from);

    ctx.reply(
        'Hello! Add me to the group you want to manage and run the /start command there to get this show on the road.'
    );
    ctx.reply("If you're not sure what to do next, use the /help command.");
};

/**
 * If the user sending the start command has already done so in a DM, persist the group and link the user to the group.
 * Then, message the user in a DM to let them know the next step.
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx A TelegrafContext for the start command message
 */
const handleGroupStart = async (ctx) => {
    const user = await findUser(ctx.from);
    if (user) {
        await addChat(ctx.chat, ctx.from);

        ctx.reply(
            'Success! Now you can manage your settings for this group back in our private chat.'
        );
    } else {
        ctx.reply(
            "Hol' up. Please send the /start command in a private message with me first."
        );
    }
};
