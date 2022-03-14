import { isPrivateChat, isUserAdmin } from '../../src/utils/telegramUtils';
import { mockContext } from '../mockContext';
jest.mock('../../src/utils/telegramUtils');

describe('telegramUtils', () => {
  it('should check if the chat type is private', () => {
    expect(isPrivateChat(mockContext('any message here'))).toBe(true);
    expect(
      isPrivateChat(mockContext('any message here', { type: 'group' })),
    ).toBe(false);
  });

  it('should check if the user is an admin (mocked)', async () => {
    const joe = await isUserAdmin(mockContext('any text message'), 333333333);
    expect(joe).toBe(false);

    const admin = await isUserAdmin(mockContext('any text message'), 222222222);
    expect(admin).toBe(true);
  });
});
