"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSelectSuggestion = async (text: string) => {
    const newMsg = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMsg] }),
      });
      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Unable to connect to the server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh w-dvw bg-[#0a0a0f] bg-grid flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-full max-h-[860px] rounded-2xl bg-[#0e0e15] border border-white/[0.06] shadow-2xl flex flex-col overflow-hidden">
        <ChatHeader darkMode={darkMode} setDarkMode={setDarkMode} />
        <ChatMessages
          messages={messages}
          loading={loading}
          onSelectSuggestion={handleSelectSuggestion}
        />
        <ChatInput
          messages={messages}
          setMessages={setMessages}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
