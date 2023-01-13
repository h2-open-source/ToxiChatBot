import { Context } from 'grammy';
import { Chat, ChatFromGetChat } from '@grammyjs/types';
import { okAsync, ResultAsync } from 'neverthrow';

import { isUser } from '../../utils/typeGuards';
import { findChatOptins } from '../../modules/db';
import { logError } from '../../utils/log';
import { DbErrorType } from '../../modules/db/types';

const hasFullName = (user: Chat.PrivateChat) =>
  'first_name' in user && 'last_name' in user;

const formatName = (user: ChatFromGetChat) => {
  if (!isUser(user)) return '';

  const name = hasFullName(user)
    ? `${user.first_name} ${user.last_name}`
    : user.first_name;

  return user.username ? `${name} (@${user.username})` : name;
};

// TODO: move to own file
const ascending = (a: unknown, b: unknown) => (a > b ? 1 : -1);
const descending = (a: unknown, b: unknown) => (a < b ? 1 : -1);

// TODO: move to own file
const okOrLog = <T>(
  unsafePromise: Promise<T>,
  message = `Error thrown in unsafe promise: ${unsafePromise.toString()}`,
) =>
  ResultAsync.fromPromise(unsafePromise, (error) =>
    logError({ message, error }),
  );

// TODO: move to own file
const safePromises = (...args: Promise<unknown>[]) =>
  ResultAsync.combine(args.map((arg: Promise<unknown>) => okOrLog(arg)));

/**
 * Replies with list of users that have clicked the opt-in button in the specified group.
 *
 * @param ctx
 */
export const listGroup = async (ctx: Context): Promise<void> => {
  const groupId = Number(ctx.match[1]);
  const chatOptinsResult = await findChatOptins(groupId);

  const respond = (message: string) =>
    safePromises(ctx.answerCallbackQuery(), ctx.reply(message));

  // TODO: Show the 'typing' chat action

  chatOptinsResult
    .map((chat) =>
      ResultAsync.fromPromise(
        Promise.all(chat.users.map((u) => ctx.api.getChat(u))),
        (error) => {
          logError('Apparent Telegram error: ', error);
          return respond(
            `Sorry, there was an error contacting Telegram. Please try again.`,
          );
        },
      ).andThen((users) => {
        const userList = users.map(formatName).sort(ascending).join('\n');

        return respond(`These members clicked the button:\n\n${userList}`);
      }),
    )
    .mapErr((error) =>
      error.type === DbErrorType.NotFound
        ? respond('No users have clicked the button in that group yet 😢')
        : // No need to log again or anything, the DB is handling unexpected errors
          okAsync(null),
    );
};
