import { Chat, Message } from 'typegram';

export const isTextMessage = (
  message: Message.CommonMessage,
): message is Message.TextMessage => 'text' in message;

export const isReply = (
  message: Message.CommonMessage,
): message is Message.TextMessage => 'reply_to_message' in message;

export const hasTitle = (chat: unknown): chat is Chat.TitleChat =>
  'title' in (chat as Chat.TitleChat);

export const isUser = (chat: unknown): chat is Chat.PrivateChat =>
  'first_name' in (chat as Chat.PrivateChat);
