/* eslint-disable no-console */
const logError = (...err: (Error | string | unknown)[]): void =>
  console.error(...err);

const logMessage = (...message: string[]): void => console.log(...message);

const logErrorAndReturn = (error: Error | string | unknown) => {
  logError(error);
  return error;
};

export { logMessage, logError, logErrorAndReturn };
