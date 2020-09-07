/* eslint-disable no-console */
/**
 *
 * @param {Error} err
 */
const logError = err => console.error(err);

/**
 *
 * @param {string} message
 */
const logMessage = (...message) => console.log(...message);

export {
    logMessage,
    logError,
};
