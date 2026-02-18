'use client';

import { FormEvent, useState } from 'react';

export const ChatInput = ({ onSend, disabled }: { onSend: (value: string) => Promise<void>; disabled: boolean }) => {
  const [value, setValue] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = value.trim();
    if (!payload) return;
    setValue('');
    await onSend(payload);
  };

  return (
    <form className="chat-input-row" onSubmit={submit}>
      <input
        className="input"
        value={value}
        placeholder="Ask about scan dimensions, mask volume, windowing..."
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
      />
      <button className="btn" type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  );
};
