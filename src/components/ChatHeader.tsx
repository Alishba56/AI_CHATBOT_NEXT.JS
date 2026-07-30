"use client";

import { Sun, Moon, Bot } from "lucide-react";

export default function ChatHeader({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Bot className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h1 className="text-[15px] font-semibold text-white">AI Assistant</h1>
          <p className="text-[11px] text-white/40">by Alishba Shahzad</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
          <span className="text-[11px] font-medium text-emerald-400">Online</span>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
