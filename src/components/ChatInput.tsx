"use client";

// ✅ Fix for SpeechRecognition types (for TypeScript)
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }

  interface SpeechRecognitionEvent extends Event {
    results: {
      [index: number]: {
        [index: number]: { transcript: string };
      };
    };
  }

  interface SpeechRecognition {
    lang: string;
    interimResults: boolean;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    start: () => void;
    stop: () => void;
  }
}

import { useState, useRef } from "react";
import { Mic, Send } from "lucide-react";

type Message = {
  role: string;
  content: string;
};

type ChatInputProps = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  darkMode: boolean;
  setLoading: (value: boolean) => void;
};

export default function ChatInput({
  messages,
  setMessages,
  darkMode,
  setLoading,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // 🎤 Start voice recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => sendMessage(), 100);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 📨 Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMsg] }),
      });

      const data = (await res.json()) as { reply: string };

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "⚠️ Unable to connect to the server.";
      console.error("Error:", message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex gap-2 items-end p-4 border-t ${
        darkMode ? "border-gray-700" : "border-gray-300"
      }`}
    >
      {/* 🎤 Mic */}
      <button
        onClick={startListening}
        className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
          listening
            ? "bg-red-600"
            : darkMode
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-gray-300 hover:bg-gray-400"
        }`}
      >
        <Mic
          className={`${darkMode ? "text-white" : "text-gray-900"} w-5 h-5`}
        />
      </button>

      {/* 📝 Text Input */}
      <textarea
        className={`flex-1 border rounded-xl p-2 outline-none resize-none overflow-hidden max-h-32 focus:ring-2 transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900 border-gray-700 text-gray-100 focus:ring-blue-500"
            : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
        }`}
        placeholder={listening ? "Listening..." : "Type a message..."}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        rows={1}
      />

      {/* 📩 Send */}
      <button
        onClick={sendMessage}
        className={`h-10 px-4 flex items-center justify-center rounded-xl transition-colors duration-300 ${
          darkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
