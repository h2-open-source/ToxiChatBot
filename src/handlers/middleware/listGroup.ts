import { Context } from 'telegraf';
import { Chat, ChatFromGetChat } from 'typegram';
import { findChatOptins } from '../../modules/db';

const isUser = (chat: any): chat is Chat.PrivateChat => 'first_name' in chat;

const hasFullName = (user: Chat.PrivateChat) =>
  'first_name' in user && 'last_name' in user;

const formatName = (user: ChatFromGetChat) => {
  if (!isUser(user)) return '';

  const name = hasFullName(user)
    ? `${user.first_name} ${user.last_name}`
    : user.first_name;

  return user.username ? `${name} (@${user.username})` : name;
};

/**
 * Replies with list of users that have clicked the opt-in button in the specified group.
 *
 * @param ctx
 */
export const listGroup = async (
  ctx: Context & {
    match: RegExpExecArray;
  },
) => {
  const groupId = Number(ctx.match[1]);
  const chat = await findChatOptins(groupId);

  if (!chat?.users) {
    return ctx.reply('No users have clicked the button in that group yet 😢');
  }

  // TODO: Show the 'typing' chat action
  const users = await Promise.all(
    chat.users.map((u) => ctx.telegram.getChat(u)),
  );

  const userList = users
    .map(formatName)
    .sort((a, b) => (a > b ? 1 : -1))
    .join('\n');

  return ctx.reply(`These members clicked the button:\n\n${userList}`);
};
