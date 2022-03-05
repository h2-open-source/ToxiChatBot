import {
  //addedToGroup,
  //generate,
  //listHandler,
  //listGroup,
  //optin,
  //toxicity,
  //start,
  help,
} from '../../src/middleware/handlers';
import { Context } from 'grammy';
import { bot } from '../bot';

function mockContext(message, options = {}) {
  const update = {
    update_id: 111111111,
    message: {
      message_id: 42069,
      from: {
        id: 222222222,
        is_bot: false,
        first_name: '𝙳𝚢𝚕𝚊𝚗',
        username: 'turdfurgeson',
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
      entities: [{ offset: 0, length: 5, type: 'bot_command' }],
    },
  };
  const api = { raw: {}, config: {} };
  const me = {
    id: 42,
    is_bot: true,
    first_name: 'ToxiChatBot',
    username: 'ToxiChatBot',
    can_join_groups: true,
    can_read_all_group_messages: true,
    supports_inline_queries: true,
  };
  return new Context(update, api, me);
}

let outgoingRequests = [];

describe('handlers', () => {
  beforeAll(async () => {
    // catch outgoing requests
    bot.api.config.use((prev, method, payload, signal) => {
      outgoingRequests.push({ method, payload, signal });
      return { ok: true, result: true };
    });

    bot.use(help);
    // start bot
    bot.botInfo = {
      id: 42,
      first_name: 'ToxiChatBot',
      is_bot: true,
      username: 'ToxiChatBot',
      can_join_groups: true,
      can_read_all_group_messages: true,
      supports_inline_queries: true,
    };
    await bot.init();
  }, 5000);

  // clear requests before each test
  beforeEach(() => {
    outgoingRequests = [];
  });

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
