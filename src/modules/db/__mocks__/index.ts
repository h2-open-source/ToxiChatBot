import { Chat as TelegramChat, User as TelegramUser } from '@grammyjs/types';
// TODO:
// mock addChat
// mock findUser
//
/**
 * Persist a user.
 *
 * @param telegramUser The Telegram user object to persist
 */
export const addUser = async (telegramUser: TelegramUser): Promise<void> => {
  return new Promise((res, rej) => {
    if(telegramUser === undefined) {
      rej({error: 'Missing user!'});
    }
    else {
      res();
    }
  });
};

/**
 * Persist chat and add the user to it.
 *
 * @param chat The Telegram chat object to add
 * @param user The Telegram user object to link the chat to
 *
 * @returns
 */
export const addChat = async (
  telegramChat: TelegramChat,
  telegramUser: TelegramUser,
): Promise<void> => {
  return new Promise((res, rej) => {
    if(telegramChat === undefined || telegramUser === undefined) {
      rej({error: 'Missing chat or user!'});
    } else {
      res();
    }

  });
};

/**
 * Find a user stored in persistence.
 *
 * @param telegramUser The Telegram user to find
 *
 * @returns The stored User
 */
export const findUser = async (telegramUser: TelegramUser): Promise<{}> => {
  return new Promise((res) => {
    if(telegramUser.username === 'not found') {
      res(false);
    }
    res({id: 111111111});
  });
};
