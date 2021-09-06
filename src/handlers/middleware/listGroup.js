import { findChatOptins } from '../../modules/db';

const formatName = (user) => {
    const name =
        user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.first_name || user.last_name;

    return user.username ? `${name} (@${user.username})` : name;
};

/**
 * Replies with list of users that have clicked the opt-in button in the specified group.
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx
 * @param { Function } next
 */
const listGroup = async (ctx, next) => {
    const groupId = ctx.match[1];
    const chat = await findChatOptins(groupId);

    if (!chat || !chat.users) {
        ctx.reply('No users have clicked the button in that group yet 😢');
    } else {
        // TODO: Show the 'typing' chat action
        const getUsers = chat.users.map((u) => ctx.telegram.getChat(u));
        const users = await Promise.all(getUsers);

        const userList = users
            .map(formatName)
            .sort((a, b) => (a > b ? 1 : -1))
            .join('\n');

        ctx.reply(`These members clicked the button:\n\n${userList}`);
    }

    return next();
};

export default listGroup;
