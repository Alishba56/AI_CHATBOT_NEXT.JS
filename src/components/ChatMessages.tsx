"use client";

import { useRef, useEffect } from "react";
import { Bot } from "lucide-react";
import MessageBubble from "./MessageBubble";
import WelcomeScreen from "./WelcomeScreen";

export default function ChatMessages({
  messages,
  loading,
  onSelectSuggestion,
}: {
  messages: { role: string; content: string }[];
  loading: boolean;
  onSelectSuggestion: (text: string) => void;
}) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (messages.length === 0) {
    return <WelcomeScreen onSelect={onSelectSuggestion} />;
  }

  return (
    <div
      ref={chatRef}
      className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-custom"
    >
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}

      {loading && (
        <div className="flex items-center gap-2.5 pl-10 animate-fade-in">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/[0.04] px-3.5 py-2.5 rounded-2xl border border-white/[0.06]">
            <span className="typing-dot bg-white/40" />
            <span className="typing-dot bg-white/40" />
            <span className="typing-dot bg-white/40" />
          </div>
        </div>
      )}
    </div>
  );
}
