'use client';

import { useMemo } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';

export const ChatPanel = () => {
  const { messages, isGenerating, sendMessage } = useChat();
  const ordered = useMemo(() => messages.slice().sort((a, b) => a.createdAt - b.createdAt), [messages]);

  return (
    <aside className="chat-shell">
      <div className="toolbar" style={{ borderBottom: '1px solid #2e3440' }}>
        <strong>Clinical Assistant</strong>
      </div>
      <div className="chat-messages">
        {ordered.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <ChatInput onSend={sendMessage} disabled={isGenerating} />
    </aside>
  );
};
