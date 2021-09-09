import { toxicityProbability } from 'modules/api/perspective';

/**
 * Send an introduction when the bot is added to a group.
 *
 * @param { import('telegraf/typings/context').TelegrafContext } ctx
 */
export const toxicity = async (ctx) => {
  const { message } = ctx;

  if (!message.reply_to_message)
    return ctx.reply(`You'll need to use that command in a reply.`);

  const result = await toxicityProbability(message.reply_to_message.text);

  if (result.error)
    return ctx.reply(
      `Sorry, the Perspective API request failed. Please try again later.`,
    );

  return ctx.reply(`${result.score}% likely to be toxic.`);
};
