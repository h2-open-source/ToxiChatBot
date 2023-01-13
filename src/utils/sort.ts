/**
 * For use in Array.sort().
 *
 * @returns 1 if the first argument is greater than the second, otherwise -1.
 */
export const ascending = (a: unknown, b: unknown) => (a > b ? 1 : -1);

/**
 * For use in Array.sort().
 *
 * @returns 1 if the first argument is less than the second, otherwise -1.
 */
export const descending = (a: unknown, b: unknown) => (a < b ? 1 : -1);
