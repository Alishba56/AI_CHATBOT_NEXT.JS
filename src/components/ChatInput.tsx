"use client";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }
  interface SpeechRecognitionEvent extends Event {
    results: { [index: number]: { [index: number]: { transcript: string } } };
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

import { useState, useRef, useCallback } from "react";
import { ArrowUp, Mic, Globe, Volume2, VolumeX } from "lucide-react";

type Message = { role: string; content: string };
type Props = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setLoading: (v: boolean) => void;
};

export default function ChatInput({ messages, setMessages, setLoading }: Props) {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState<"en-US" | "ur-PK">("en-US");
  const [voiceOn, setVoiceOn] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetSilenceTimer = useCallback((recognition: SpeechRecognition) => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => recognition.stop(), 5000);
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported."); return; }
    const recognition = new SR();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.onstart = () => { setListening(true); resetSilenceTimer(recognition); };
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
      resetSilenceTimer(recognition);
      setTimeout(() => sendMessage(event.results[0][0].transcript), 200);
    };
    recognitionRef.current = recognition;
    recognition.start();
  }, [language, resetSilenceTimer]);

  const speakText = useCallback((text: string) => {
    if (!voiceOn || typeof window === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  }, [voiceOn, language]);

  const sendMessage = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;
    setInput("");
    const newMsg: Message = { role: "user", content: text };
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
      speakText(data.reply);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Unable to connect to the server." }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, setMessages, setLoading, speakText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  };

  const hasText = input.trim().length > 0;

  return (
    <div className="px-4 py-3 border-t border-white/[0.06]">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLanguage((p) => (p === "en-US" ? "ur-PK" : "en-US"))}
            title="Switch language"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setVoiceOn((p) => !p)}
            title={voiceOn ? "Mute voice" : "Enable voice"}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              voiceOn
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-white/30 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        <div className={`flex-1 flex items-end rounded-xl border transition-all ${
          listening
            ? "border-red-500/40 bg-red-500/5"
            : "border-white/[0.08] bg-white/[0.04] focus-within:border-white/[0.15]"
        }`}>
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white/90 placeholder-white/25 outline-none resize-none max-h-40 rounded-xl"
            placeholder={listening ? `Listening (${language === "en-US" ? "EN" : "UR"})...` : "Type a message..."}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            onClick={() => startListening()}
            className={`w-8 h-8 flex items-center justify-center rounded-lg mr-1.5 mb-1.5 transition-all ${
              listening
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : "text-white/30 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <Mic className={`w-4 h-4 ${listening ? "animate-pulse" : ""}`} />
          </button>
        </div>

        <button
          onClick={() => sendMessage()}
          disabled={!hasText}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
            hasText
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              : "bg-white/[0.05] text-white/20"
          }`}
        >
          <ArrowUp className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
