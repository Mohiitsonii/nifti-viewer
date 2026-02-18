'use client';

import { useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useViewerStore } from '@/store/viewerStore';
import { generateMockAssistantResponse } from '@/lib/chat/chatEngine';

export const useChat = () => {
  const messages = useChatStore((state) => state.messages);
  const isGenerating = useChatStore((state) => state.isGenerating);
  const addMessage = useChatStore((state) => state.addMessage);
  const setIsGenerating = useChatStore((state) => state.setIsGenerating);

  const volume = useViewerStore((state) => state.volume);
  const metadata = useViewerStore((state) => state.metadata);
  const segmentation = useViewerStore((state) => state.segmentation);

  const sendMessage = useCallback(
    async (input: string) => {
      if (!input.trim()) return;
      addMessage('user', input);
      setIsGenerating(true);

      try {
        const content = await generateMockAssistantResponse(input, {
          volume,
          metadata,
          segmentation,
          history: messages,
        });
        addMessage('assistant', content);
      } finally {
        setIsGenerating(false);
      }
    },
    [addMessage, messages, metadata, segmentation, setIsGenerating, volume],
  );

  return { messages, isGenerating, sendMessage };
};
