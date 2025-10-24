"use client";

import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingDots from "./TypingDots";

export default function ChatMessages({
  messages,
  darkMode,
  loading,
}: {
  messages: { role: string; content: string }[];
  darkMode: boolean;
  loading: boolean;
}) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      // smooth scroll to bottom when messages update
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      ref={chatRef}
      // note: use overflow-y-auto so scroll behaves naturally; transform-none to avoid accidental rotation
      className="flex-1 overflow-y-auto p-4 space-y-3   scrollbar-hidden transform-none"
    >
      {messages.map((msg, i) => (
<MessageBubble key={i} message={msg} darkMode={darkMode} />
      ))}

      {loading && (
        <div className="flex items-center gap-2 text-gray-400">
          <span className="select-none">Typing</span>
          <TypingDots darkMode={darkMode} />
        </div>
      )}
    </div>
  );
}
