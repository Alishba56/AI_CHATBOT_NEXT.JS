"use client";

import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false); // ✅ added this state

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } flex justify-center items-center min-h-screen p-4 transition-colors duration-300`}
    >
      <div
        className={`flex flex-col w-full max-w-5xl h-[90vh] rounded-2xl shadow-xl border ${
          darkMode ? "bg-[#0f172a] border-gray-700" : "bg-white border-gray-300"
        } transition-colors duration-300`}
      >
        {/* Header */}
        <ChatHeader darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Messages */}
        <ChatMessages
          messages={messages}
          darkMode={darkMode}
          loading={loading} // ✅ now it exists
        />

    <ChatInput
  messages={messages}
  setMessages={setMessages}
  darkMode={darkMode}
  setLoading={setLoading} // ✅ pass from ChatBox
/>
      </div>
    </div>
  );
}
