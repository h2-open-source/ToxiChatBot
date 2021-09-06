// eslint-disable-next-line no-unused-vars
import localenv from 'localenv';
import express from 'express';
import crypto from 'crypto';
import { logMessage, logError } from './utils/log';
import bot from './modules/bot';
import mongoinit from './modules/db/mongodb-init';
import middleware from './handlers/middleware';
import start from './handlers/middleware/start';
import help from './handlers/middleware/help';

// If not in the production environment, try to use the URL argument.
// If in production, or if the URL argument is absent, use the environment variable.
const url =
    (process.env.NODE_ENV !== 'production' && process.argv[2]) ||
    process.env.BOT_URL;

bot.start(start);
bot.help(help);

bot.use(middleware);

const hash = crypto
    .createHash('sha256')
    .update(process.env.BOT_TOKEN)
    .digest('base64');
bot.telegram.setWebhook(`${url}/${hash}`);

const app = express();
app.use(bot.webhookCallback(`/${hash}`));
app.listen(3000, () => {
    // TODO: stop the app if connection fails
    mongoinit();

    logMessage('Bot listening on port 3000!');
});

bot.catch(logError);
