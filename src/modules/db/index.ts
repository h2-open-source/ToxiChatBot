import mongoose, { ObjectId } from 'mongoose';
import { Chat as TelegramChat, User as TelegramUser } from '@grammyjs/types';
import { okAsync, errAsync, err, ResultAsync } from 'neverthrow';

import { DbResult, NotFoundError, OtherError } from './types';
import { logError } from '../../utils/log';

// TODO: move schemas (and models?) to their own files
interface IChat extends Document {
  _id: ObjectId;
  id: number;
  users: ObjectId[];
  watching: boolean;
}
const chatSchema = new mongoose.Schema<IChat>({
  id: { type: Number, required: true, unique: true },
  users: [mongoose.Types.ObjectId],
  watching: { type: Boolean, required: true, default: false },
});
const Chat = mongoose.model('Chat', chatSchema);

interface IUser extends Document {
  _id: ObjectId;
  id: number;
}
const userSchema = new mongoose.Schema<IUser>({
  id: { type: Number, required: true, unique: true },
});
const User = mongoose.model('User', userSchema);

interface IOptin extends Document {
  _id: ObjectId;
  chatId: number;
  users: number[];
}
const optinSchema = new mongoose.Schema<IOptin>({
  chatId: { type: Number, required: true, unique: true },
  users: [Number],
});
const Optin = mongoose.model('Optin', optinSchema);

/**
 * Persist a user.
 *
 * @param telegramUser The Telegram user object to persist
 */
export const addUser = (telegramUser: TelegramUser): DbResult<IUser> =>
  ResultAsync.fromPromise(
    User.findOneAndUpdate(
      { id: telegramUser.id },
      { $setOnInsert: { id: telegramUser.id } },
      { upsert: true, new: true },
    ),
    (error) => {
      logError(error);
      return OtherError(error);
    },
  );

/**
 * Find a user stored in persistence.
 *
 * @param telegramUser The Telegram user to find
 *
 * @returns The stored User
 */
export const findUser = (telegramUser: TelegramUser): DbResult<IUser> => {
  const findResult = ResultAsync.fromPromise(
    User.findOne({ id: telegramUser.id }),
    (error) => {
      logError(error);
      return OtherError({ error });
    },
  );

  return findResult.andThen((user) =>
    user !== null
      ? okAsync(user)
      : errAsync(
          NotFoundError(`User with Telegram ID ${telegramUser.id} not found`),
        ),
  );
};

/**
 * Retrieve a list of all stored Chats in which the telegramUser has initialized the bot
 *
 * @param telegramUser
 *
 * @returns An array of stored Chats
 */
export const findChatsForUser = (
  telegramUser: TelegramUser,
): DbResult<IChat[]> =>
  findUser(telegramUser).andThen((user) =>
    ResultAsync.fromPromise(Chat.find({ users: user._id }), (error) => {
      logError(error);
      return OtherError(error);
    }),
  );

/**
 * Retrieve a stored OptIn record by its Telegram Chat ID
 *
 * @param chatId
 *
 * @returns The Optin document
 */
export const findChatOptins = async (chatId: number): Promise<IOptin> => {
  try {
    return await Optin.findOne({ chatId });
  } catch (error) {
    logError(error);
  }

  return null;
};

/**
 * Persist chat and add the user to it.
 *
 * @param chat The Telegram chat object to add
 * @param user The Telegram user object to link the chat to
 *
 * @returns
 */
export const addChat = (
  telegramChat: TelegramChat,
  telegramUser: TelegramUser,
): DbResult<IChat> =>
  findUser(telegramUser).andThen((user) =>
    ResultAsync.fromPromise(
      Chat.findOneAndUpdate(
        { id: telegramChat.id },
        { $setOnInsert: { id: telegramChat.id, users: [user._id] } },
        { upsert: true, new: true },
      ),
      (error) => {
        logError(error);
        return OtherError(error);
      },
    ),
  );

/**
 * Record user opt-in
 *
 * @param chat The Telegram chat object the button was clicked in
 * @param user The Telegram user object who clicked the buttoto link the chat ton
 *
 * @returns
 */
export const addUserOptIn = async (
  telegramChat: TelegramChat,
  telegramUser: TelegramUser,
): Promise<void> => {
  try {
    const newChat = await Optin.findOneAndUpdate(
      { chatId: telegramChat.id },
      {
        $addToSet: { users: telegramUser.id },
        $setOnInsert: { id: telegramChat.id },
      },
      { upsert: true, new: true },
    );

    if (newChat === null) throw Error('Failed to create optin chat');
  } catch (error) {
    logError(error);
  }
};

/**
 * Find all chats for a user which aren't being watched
 *
 * @param telegramUser The Telegram user
 *
 * @returns The stored Chats
 */
export const getUserChatsUnwatched = (
  telegramUser: TelegramUser,
): DbResult<IChat[]> =>
  findUser(telegramUser).andThen((user) =>
    ResultAsync.fromPromise(
      Chat.find({
        users: user._id,
        $or: [{ watching: false }, { watching: null }],
      }),
      (error) => {
        logError(error);
        return OtherError(error);
      },
    ),
  );

/**
 * Set the watching status of the specified chat
 *
 * @param telegramChat The Telegram chat, or its id, to set watching for
 * @param watching Watching status to apply
 */
export const setChatWatching = async (
  telegramChat: TelegramChat | number,
  watching = true,
): Promise<DbResult<IChat>> => {
  try {
    const id =
      typeof telegramChat === 'number' ? telegramChat : telegramChat.id;
    return okAsync(await Chat.findOneAndUpdate({ id }, { watching }));
  } catch (e) {
    logError(e);
    return err(e);
  }
};
