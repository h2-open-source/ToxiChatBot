import { Composer } from 'telegraf';

import addedToGroup from './addedToGroup';
import generate from './generate';
import optin from './optin';

const composer = new Composer();

composer.on('new_chat_members', addedToGroup);

composer.command('generate', generate);

composer.action('optin', optin);

export default composer;
