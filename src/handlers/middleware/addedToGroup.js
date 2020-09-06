import { Extra } from 'telegraf';

// TODO: test this
const addedToGroupHandler = async (ctx, next) => {
  const { message } = ctx;

  const { username } = await ctx.telegram.getMe();

  const botWasAdded = message.new_chat_members
    .some(user => user.username === username);

  if (botWasAdded) {
    // TODO: save group

    // TODO: Move this. This should be posted in response to an Admin in a DM with the bot
    ctx.reply(
      'Do you want to stay in this group? Click this button.',
      Extra.HTML().markup(m => m.inlineKeyboard([
        m.callbackButton('I want to stay!', 'optin'),
      ])),
    );

    ctx.reply(`Hi there, I'm ${process.env.BOT_NAME}`);
  }

  return next();
};

export default addedToGroupHandler;
