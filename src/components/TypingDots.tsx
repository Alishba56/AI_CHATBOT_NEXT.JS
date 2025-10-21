"use client";

import { motion } from "framer-motion";

export default function TypingDots({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <motion.span
        className={`w-2 h-2 rounded-full ${
          darkMode ? "bg-gray-300" : "bg-gray-700"
        }`}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
      />
      <motion.span
        className={`w-2 h-2 rounded-full ${
          darkMode ? "bg-gray-300" : "bg-gray-700"
        }`}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.span
        className={`w-2 h-2 rounded-full ${
          darkMode ? "bg-gray-300" : "bg-gray-700"
        }`}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}
