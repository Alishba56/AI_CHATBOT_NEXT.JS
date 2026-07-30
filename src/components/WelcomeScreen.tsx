"use client";

import { motion } from "framer-motion";
import { Sparkles, Code, Brain, Globe, MessageSquare } from "lucide-react";

const suggestions = [
  { icon: <Brain className="w-4 h-4" />, text: "Explain a concept simply" },
  { icon: <Code className="w-4 h-4" />, text: "Write production-ready code" },
  { icon: <MessageSquare className="w-4 h-4" />, text: "Draft a professional email" },
  { icon: <Globe className="w-4 h-4" />, text: "Summarize latest tech trends" },
];

export default function WelcomeScreen({
  onSelect,
}: {
  onSelect: (text: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-500/20">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white/90">
          How can I help you today?
        </h2>
        <p className="text-sm text-white/40 max-w-sm text-center leading-relaxed">
          Ask me anything — I can help you code, write, analyze, and more.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="grid grid-cols-2 gap-2.5 w-full max-w-lg"
      >
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
            onClick={() => onSelect(s.text)}
            className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm text-left transition-all bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-white/60 hover:text-white/80"
          >
            <span className="text-purple-400">{s.icon}</span>
            {s.text}
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-[11px] text-white/20 text-center"
      >
        Powered by Gemini AI &middot; Built with Next.js
      </motion.p>
    </div>
  );
}
