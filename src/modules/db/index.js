import mongoose from 'mongoose';
import { logError, logMessage } from '../../utils/log';

// TODO: move schemas (and models?) to their own files
const chatSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    users: [mongoose.Types.ObjectId],
});
const Chat = mongoose.model('Chat', chatSchema);

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
});
const User = mongoose.model('User', userSchema);

/**
 * Persist a user.
 *
 * @param { import('telegraf/typings/telegram-types').User } telegramUser The Telegram user object to persist
 */
export const addUser = async (telegramUser) => {
    try {
        await User.findOneAndUpdate(
            { id: telegramUser.id },
            { $setOnInsert: { id: telegramUser.id } },
            { upsert: true, new: true }
        );
    } catch (err) {
        logError(err);
    }
};

/**
 * Find a user stored in persistence.
 *
 * @param { import('telegraf/typings/telegram-types').User } telegramUser The Telegram user to find
 *
 * @returns { object } The stored User
 */
export const findUser = async (telegramUser) => {
    try {
        return await User.findOne({ id: telegramUser.id });
    } catch (err) {
        logError(err);
    }
    return null;
};

/**
 * Persist chat and add the user to it.
 *
 * @param { import('telegraf/typings/telegram-types').Chat } chat The Telegram chat object to add
 * @param { import('telegraf/typings/telegram-types').User } user The Telegram user object to link the chat to
 */
export const addChat = async (telegramChat, telegramUser) => {
    try {
        const user = await findUser(telegramUser);

        const newChat = await Chat.findOneAndUpdate(
            { id: telegramChat.id },
            { $setOnInsert: { id: telegramChat.id, users: [user._id] } },
            { upsert: true, new: true }
        );

        if (newChat === null) throw Error('Failed to create telegramChat');
    } catch (err) {
        logError(err);
    }
};

export const addUserOptIn = (user, group) => {};

export default {
    addUser,
    addUserOptIn,
};
