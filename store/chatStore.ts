import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type { ChatMessage } from '@/types/chat';

interface ChatStoreState {
  messages: ChatMessage[];
  isGenerating: boolean;
  addMessage: (role: ChatMessage['role'], content: string) => ChatMessage;
  setIsGenerating: (isGenerating: boolean) => void;
  clear: () => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  messages: [
    {
      id: uuid(),
      role: 'system',
      content: 'Medical assistant initialized. Ask about volume metadata or segmentation statistics.',
      createdAt: Date.now(),
    },
  ],
  isGenerating: false,
  addMessage: (role, content) => {
    const message = { id: uuid(), role, content, createdAt: Date.now() };
    set((state) => ({ messages: [...state.messages, message] }));
    return message;
  },
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  clear: () =>
    set({
      messages: [],
      isGenerating: false,
    }),
}));
