import { Context } from 'grammy';

export const botDetails = {
  id: 42,
  is_bot: true,
  first_name: process.env.BOT_NAME,
  username: process.env.BOT_USERNAME,
};
export const me = {
  can_join_groups: true,
  can_read_all_group_messages: true,
  supports_inline_queries: true,
  allowed_updates: true,
};

export const mockContext = (message, options = {}) => {
  let update = {
    update_id: 111111111,
    message: {
      message_id: 42069,
      from: {
        id: 'userId' in options ? options.userId : 333333333, //222222222 is admin in mocks
        is_bot: false,
        first_name: 'Test',
        username: 'userId' in options ? options.username : 'test_user',
        language_code: 'en',
      },
      chat: {
        id: 333333333,
        first_name: 'Test User',
        username: 'test_user_name',
        type: 'private',
      },
      date: 1645985137,
      text: message,
      entities: [{ offset: 0, length: message.length, type: 'bot_command' }],
    },
  };
  const api = { raw: {}, config: {} };
  if ('type' in options && options.type === 'group') {
    update.message.chat.type = 'group';
    update.message.chat.title = 'Test group';
    update.message.chat.all_members_are_administrators = false;
    delete update.message.chat.first_name;
    delete update.message.chat.username;
  }
  if ('new_chat_member' in options && options.new_chat_member === 'me') {
    update.message.new_chat_participant = botDetails;
    update.message.new_chat_member = botDetails;
    update.message.new_chat_members = [botDetails];
    delete update.message.text;
    delete update.message.entities;
  }
  return new Context(update, api, { ...botDetails, ...me });
};
