// Unused
const addedToGroupHandler = async (ctx, next) => {
    const { message } = ctx;

    const { username } = await ctx.telegram.getMe();

    const botWasAdded = message.new_chat_members.some(
        (user) => user.username === username
    );

    if (botWasAdded) {
        ctx.reply(`Hi there, I'm ${process.env.BOT_NAME}`);
    }

    return next();
};

export default addedToGroupHandler;
