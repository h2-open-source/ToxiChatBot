import { roundToTwo } from '../../src/utils/roundToTwo';

describe('roundToTwo', () => {
  it('should round the number to two decimal places if needed', () => {
    expect(roundToTwo(10)).toBe(10);
    expect(roundToTwo(1.77777777)).toBe(1.78);
    expect(roundToTwo(9.1)).toBe(9.1);
  });
});
