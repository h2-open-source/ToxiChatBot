import { Composer } from 'grammy';
import { logError } from '../../utils/log';
import { addedToGroup } from './addedToGroup';
import { generate } from './generate';
import { listHandler } from './list';
import { listGroup } from './listGroup';
import { optin } from './optin';
import { toxicity } from './toxicity';
import { start } from './start';
import { help } from './help';

const composer = new Composer();

composer.on(':new_chat_members:me', addedToGroup);

composer.command('start', start);
composer.command('help', help);

composer.command('toxicity', toxicity);

composer.command('generate', generate);
composer.callbackQuery('optin', optin);

composer.command('list', listHandler);
composer.callbackQuery(/^[list-]+(-[\d]+)$/, listGroup);

composer.on('callback_query:data', async (ctx) => {
  logError('Unknown button event with payload', ctx.callbackQuery.data);
  await ctx.answerCallbackQuery(); // remove loading animation
});

export { composer as middleware };
