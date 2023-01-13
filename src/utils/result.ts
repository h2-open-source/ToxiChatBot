import { ResultAsync } from 'neverthrow';

import { logError } from './log';

/**
 * Wrap a Promise in a ResultAsync and log the error if it throws
 */
export const okOrLog = <T>(
  unsafePromise: Promise<T>,
  message = `Error thrown in unsafe promise: ${unsafePromise.toString()}`,
) =>
  ResultAsync.fromPromise(unsafePromise, (error) =>
    logError({ message, error }),
  );

/**
 * Apply okOrLog to each promise, making all promises safe to run while logging any errors
 */
export const safePromises = (...args: Promise<unknown>[]) =>
  ResultAsync.combine(args.map((arg: Promise<unknown>) => okOrLog(arg)));
