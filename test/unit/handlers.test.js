import { middleware } from '../../src/middleware';
import { Context } from 'grammy';
import { bot } from '../bot';

jest.mock('../../src/modules/db');
jest.mock('../../src/utils/telegramUtils');

const me = {
  id: 42,
  is_bot: true,
  first_name: 'ToxiChatBot',
  username: 'ToxiChatBot',
  can_join_groups: true,
  can_read_all_group_messages: true,
  supports_inline_queries: true,
};

function mockContext(message, options = {}) {
  const update = {
    update_id: 111111111,
    message: {
      message_id: 42069,
      from: {
        id: 'userId' in options ? options.userId : 333333333, //222222222 is admin in mocks
        is_bot: false,
        first_name: '𝙳𝚢𝚕𝚊𝚗',
        username: 'userId' in options ? options.username : 'test_user',
        language_code: 'en',
      },
      chat: {
        id: 333333333,
        first_name: '𝙳𝚢𝚕𝚊𝚗',
        username: 'turdfurgeson',
        type: 'type' in options ? options.type : 'private',
      },
      date: 1645985137,
      text: message,
      entities: [{ offset: 0, length: message.length, type: 'bot_command' }],
    },
  };
  const api = { raw: {}, config: {} };
  return new Context(update, api, me);
}

let outgoingRequests = [];

beforeAll(async () => {
  // catch outgoing requests
  bot.api.config.use((prev, method, payload, signal) => {
    outgoingRequests.push({ method, payload, signal });
    return { ok: true, result: true };
  });

  // set handlers
  bot.use(middleware);

  // start bot
  bot.botInfo = me;
  await bot.init();
}, 5000);

// clear requests before each test
beforeEach(() => {
  outgoingRequests = [];
});
describe('help handler', () => {
  it('should reply with private help message', async () => {
    await bot.handleUpdate(mockContext('/help'));

    expect(outgoingRequests.length).toBe(2);
    expect(outgoingRequests.pop().payload.text).toBe(
      '/generate - Create the opt-in button\n' +
        "/list - Show a list of all the groups your buttons were forwarded to and see who's clicked them",
    );
    expect(outgoingRequests.pop().payload.text).toBe("Here's what I can do: ");
  });

  it('should reply with group help message', async () => {
    await bot.handleUpdate(
      mockContext('/help', {
        type: 'group',
      }),
    );

    expect(outgoingRequests.length).toBe(1);
    expect(outgoingRequests.pop().payload.text).toBe(
      'Message me directly for more options',
    );
  });
});

describe('start handler', () => {
  it('should reply with private start message', async () => {
    await bot.handleUpdate(mockContext('/start'));

    expect(outgoingRequests.length).toBe(2);
    expect(outgoingRequests.pop().payload.text).toBe(
      "If you're not sure what to do next, use the /help command.",
    );
    expect(outgoingRequests.pop().payload.text).toBe(
      'Hello! Add me to the group you want to manage and run the /start command there to get this show on the road.',
    );
  });

  it('should reply that only admins can use the bot', async () => {
    await bot.handleUpdate(mockContext('/start', { type: 'group' }));
    expect(outgoingRequests.length).toBe(1);
    expect(outgoingRequests.pop().payload.text).toBe(
      'Only admins can use this bot.',
    );
  });

  it('should reply with group start message', async () => {
    await bot.handleUpdate(
      mockContext('/start', { type: 'group', userId: 222222222 }), // 222222222 is admin
    );
    expect(outgoingRequests.length).toBe(2);
    expect(outgoingRequests.pop().payload.text).toBe(
      'Success! Now you can manage your settings for this group.',
    );
    expect(outgoingRequests.pop().payload.text).toBe(
      'Nice! Take a look at your chat with me to get started.',
    );
  });

  it('should tell admin to private message first', async () => {
    await bot.handleUpdate(
      mockContext('/start', {
        type: 'group',
        userId: 222222222,
        username: 'not found',
      }),
    );
    expect(outgoingRequests.length).toBe(1);
    expect(outgoingRequests.pop().payload.text).toBe(
      "Hol' up. Please send the /start command in a private message with me first.",
    );
  });
});
