import { describe, it, expect } from 'jest';
import {
  init,
  prepareConnectionString,
} from '../../src/modules/db/mongodb-init';

describe('mongodb-init', () => {
  it('should return connection string', () => {
    const connectionObject = {
      user: 'user',
      password: 'password',
      server: 'server',
      database: 'database',
    };
    expect(prepareConnectionString(connectionObject)).toBe(
      'mongodb://user:password@server/database',
    );
  });

  // TODO: verify connection fails/succeeds
  // it("should error when database isn't found", () => {
  //   expect.assertions(1);
  //   return init().catch((e) =>
  //     expect(e).toContain('Error occurred while connecting to DB'),
  //   );
  // });
});
