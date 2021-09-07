import { Composer } from 'telegraf';
import { addedToGroup } from './addedToGroup';
import { generate } from './generate';
import { listHandler } from './list';
import { listGroup } from './listGroup';
import { optin } from './optin';

const composer = new Composer();

composer.on('new_chat_members', addedToGroup);

composer.command('generate', generate);

composer.command('list', listHandler);
composer.action(/^[list-]+(-[\d]+)$/, listGroup);

composer.action('optin', optin);

export { composer as middleware };
