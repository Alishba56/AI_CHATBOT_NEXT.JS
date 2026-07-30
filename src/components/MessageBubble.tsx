"use client";

import ReactMarkdown from "react-markdown";
import { Copy, Check, Bot, User } from "lucide-react";
import { useState } from "react";

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({
  message,
}: {
  message: { role: string; content: string };
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} items-start group animate-fade-in-up`}>
      <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center shadow-lg ${
        isUser
          ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20"
          : "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/20"
      }`}>
        {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
      </div>

      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`relative rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-tr-sm px-4 py-2.5 shadow-lg shadow-indigo-600/15"
            : "bg-white/[0.05] backdrop-blur-xl text-white/90 rounded-tl-sm px-4 py-2.5 border border-white/[0.06] shadow-sm"
        }`}>
          <ReactMarkdown
            components={{
              strong: ({ children }) => (
                <strong className="font-semibold text-amber-300">{children}</strong>
              ),
              em: ({ children }) => (
                <em className={`italic ${isUser ? "text-white/70" : "text-purple-300"}`}>{children}</em>
              ),
              code: ({ children }) => (
                <code className="px-1.5 py-0.5 rounded-md text-[13px] font-mono bg-black/20 text-emerald-300 border border-white/5">
                  {children}
                </code>
              ),
              p: ({ children }) => <span>{children}</span>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        <div className={`flex items-center gap-2 mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] text-white/20">{formatTime()}</span>
          {!isUser && (
            <button
              onClick={() => copyToClipboard(message.content)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/5"
            >
              {copied ? (
                <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                  <Check className="w-3 h-3" />
                </span>
              ) : (
                <Copy className="w-3 h-3 text-white/30 hover:text-white/60" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
