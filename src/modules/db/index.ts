import mongoose, { Model, ObjectId } from 'mongoose';
import { Chat, User } from 'typegram';
import { logError } from '../../utils/log';

// TODO: move schemas (and models?) to their own files
const chatSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  users: [mongoose.Types.ObjectId],
});
interface IChat extends Document {
  id: number;
  users: ObjectId[];
}
const Chat = mongoose.model('Chat', chatSchema);

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
});
interface IUser extends Document {
  id: number;
}
const User: Model<IUser> = mongoose.model('User', userSchema);

const optinSchema = new mongoose.Schema({
  chatId: { type: Number, required: true, unique: true },
  users: [Number],
});
interface IOptin extends Document {
  chatId: number;
  users: number[];
}
const Optin: Model<IOptin> = mongoose.model('Optin', optinSchema);

/**
 * Persist a user.
 *
 * @param telegramUser The Telegram user object to persist
 */
export const addUser = async (telegramUser: User) => {
  try {
    await User.findOneAndUpdate(
      { id: telegramUser.id },
      { $setOnInsert: { id: telegramUser.id } },
      { upsert: true, new: true },
    );
  } catch (err) {
    logError(err);
  }
};

/**
 * Find a user stored in persistence.
 *
 * @param telegramUser The Telegram user to find
 *
 * @returns The stored User
 */
export const findUser = async (telegramUser: User) => {
  try {
    return await User.findOne({ id: telegramUser.id });
  } catch (err) {
    logError(err);
  }
  return null;
};

/**
 * Retrieve a list of all stored Chats in which the telegramUser has initialized the bot
 *
 * @param telegramUser
 *
 * @returns An array of stored Chats
 */
export const findChatsForUser = async (telegramUser: User) => {
  try {
    const user = await findUser(telegramUser);
    return await Chat.find({ users: user._id });
  } catch (err) {
    logError(err);
  }
  return null;
};

/**
 * Retrieve a stored OptIn record by its Telegram Chat ID
 *
 * @param chatId
 *
 * @returns The Optin document
 */
export const findChatOptins = async (chatId: number) => {
  try {
    return await Optin.findOne({ chatId });
  } catch (err) {
    logError(err);
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
export const addChat = async (telegramChat: Chat, telegramUser: User) => {
  try {
    const user = await findUser(telegramUser);

    const newChat = await Chat.findOneAndUpdate(
      { id: telegramChat.id },
      { $setOnInsert: { id: telegramChat.id, users: [user._id] } },
      { upsert: true, new: true },
    );

    if (newChat === null) throw Error('Failed to create telegramChat');
  } catch (err) {
    logError(err);
  }
};

/**
 * Record user opt-in
 *
 * @param chat The Telegram chat object the button was clicked in
 * @param user The Telegram user object who clicked the buttoto link the chat ton
 *
 * @returns
 */
export const addUserOptIn = async (telegramChat: Chat, telegramUser: User) => {
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
  } catch (err) {
    logError(err);
  }
};
