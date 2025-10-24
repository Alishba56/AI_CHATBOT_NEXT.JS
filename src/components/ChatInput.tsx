"use client";

/* ✅ Fixed SpeechRecognition declarations (type + value safe) */
declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
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
    continuous?: boolean;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    start: () => void;
    stop: () => void;
  }
}

import { useState, useRef } from "react";
import { Mic, Send, Globe2, Volume2 } from "lucide-react";

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
  const [language, setLanguage] = useState<"en-US" | "ur-PK">("en-US");
  const [voiceOn, setVoiceOn] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  // 🎙️ Start voice recognition
  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onstart = () => {
      setListening(true);
      resetSilenceTimer(recognition);
    };

    recognition.onend = () => setListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      resetSilenceTimer(recognition);
      setTimeout(() => sendMessage(), 200);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 🕐 Auto-stop after silence
  const resetSilenceTimer = (recognition: SpeechRecognition) => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => {
      recognition.stop();
    }, 5000);
  };

  // 🗣️ Speak bot's reply aloud
  const speakText = (text: string) => {
    if (!voiceOn) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 1;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
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

      // 🗣️ Speak the assistant's reply
      speakText(data.reply);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "⚠️ Unable to connect to the server.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🌐 Switch language
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en-US" ? "ur-PK" : "en-US"));
  };

  // 🔊 Toggle voice output
  const toggleVoice = () => {
    setVoiceOn((prev) => !prev);
  };

  return (
    <div
      className={`flex gap-2 items-end p-4 border-t ${
        darkMode ? "border-gray-700" : "border-gray-300"
      }`}
    >
      {/* 🌐 Language Switch */}
      <button
        onClick={toggleLanguage}
        title="Switch language"
        className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
          darkMode
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-gray-300 hover:bg-gray-400 text-gray-900"
        }`}
      >
        <Globe2 className="w-5 h-5" />
      </button>

      {/* 🔊 Voice Toggle */}
      <button
        onClick={toggleVoice}
        title={voiceOn ? "Mute voice" : "Enable voice"}
        className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
          voiceOn
            ? "bg-green-600 hover:bg-green-700 text-white"
            : darkMode
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-gray-300 hover:bg-gray-400 text-gray-900"
        }`}
      >
        <Volume2 className="w-5 h-5" />
      </button>

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
        placeholder={
          listening
            ? `Listening (${language === "en-US" ? "English" : "Urdu"})...`
            : "Type a message..."
        }
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
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
