import type { ChatMessage as Message } from '@/types/chat';

export const ChatMessage = ({ message }: { message: Message }) => {
  if (message.role === 'system') {
    return <small style={{ opacity: 0.8 }}>{message.content}</small>;
  }

  return <div className={`chat-bubble ${message.role}`}>{message.content}</div>;
};
