import { ChatFromGetChat } from '@grammyjs/types';
import { hasTitle } from './typeGuards';

export function getTitle(chat: ChatFromGetChat) {
  return hasTitle(chat) ? chat.title : chat.username;
}
