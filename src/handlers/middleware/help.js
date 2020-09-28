import { isPrivateChat } from '../../utils/telegramUtils';

const handlePrivate = ({ reply }) => {
    reply("Here's what I can do: ");
    // TODO: Add better help text
    reply(
        '/generate - Create the opt-in button\n' +
            "/list - Show a list of all the groups your buttons were forwarded to and see who's clicked them"
    );
};

const handleGroup = ({ reply }) => {
    reply('Message me directly for more options');
};

export default async (ctx, next) => {
    if (isPrivateChat(ctx)) {
        await handlePrivate(ctx);
    } else {
        await handleGroup(ctx);
    }

    return next();
};
