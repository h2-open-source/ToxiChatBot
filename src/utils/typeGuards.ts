import { Message } from 'typegram';

export const isTextMessage = (
  message: Message.CommonMessage,
): message is Message.TextMessage => 'text' in message;

export const isReply = (
  message: Message.CommonMessage,
): message is Message.TextMessage => 'reply_to_message' in message;
