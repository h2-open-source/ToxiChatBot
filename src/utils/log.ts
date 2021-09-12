/* eslint-disable no-console */
const logError = (...err: Error[]): void => console.error(...err);

const logMessage = (...message: string[]): void => console.log(...message);

export { logMessage, logError };
