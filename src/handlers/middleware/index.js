import { Composer } from 'telegraf';

import addedToGroup from './addedToGroup';

const composer = new Composer();

composer.on('new_chat_members', addedToGroup);

export default composer;
