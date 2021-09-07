import mongoose from 'mongoose';
import { logError } from '../../utils/log';

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

const optinSchema = new mongoose.Schema({
	chatId: { type: Number, required: true, unique: true },
	users: [Number],
});
const Optin = mongoose.model('Optin', optinSchema);

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
 * Retrieve a list of all stored Chats in which the telegramUser has initialized the bot
 *
 * @param { import('telegraf/typings/telegram-types').User } telegramUser
 *
 * @returns { Array } An array of stored Chats
 */
export const findChatsForUser = async (telegramUser) => {
	try {
		const user = await findUser(telegramUser);
		return await Chat.find({ users: user._id });
	} catch (err) {
		logError(err);
	}
	return null;
};

/**
 * Retrieve a stored chat by its Telegram ID
 *
 * @param { Number } chatId
 *
 * @returns { Object } The Chat document
 */
export const findChatOptins = async (chatId) => {
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

export const addUserOptIn = async (telegramChat, telegramUser) => {
	try {
		const newChat = await Optin.findOneAndUpdate(
			{ chatId: telegramChat.id },
			{
				$push: { users: telegramUser.id },
				$setOnInsert: { id: telegramChat.id },
			},
			{ upsert: true, new: true }
		);

		if (newChat === null) throw Error('Failed to create optin chat');
	} catch (err) {
		logError(err);
	}
};
