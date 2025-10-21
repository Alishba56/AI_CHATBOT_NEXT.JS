"use client";

import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function MessageBubble({
  message,
  darkMode,
}: {
  message: { role: string; content: string };
  darkMode: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative p-3 rounded-2xl max-w-[80%] break-words ${
        message.role === "user"
          ? "bg-blue-600 text-white self-end ml-auto"
          : darkMode
          ? "bg-gray-800 text-gray-200"
          : "bg-gray-200 text-gray-900"
      }`}
    >
      <ReactMarkdown
        components={{
          strong: ({ children }) => (
            <strong className="text-yellow-400 font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-blue-300">{children}</em>,
          code: ({ children }) => (
            <code className="bg-gray-700 px-1 py-0.5 rounded text-sm font-mono text-green-300">
              {children}
            </code>
          ),
          p: ({ children }) => <span className="font-normal">{children}</span>,
        }}
      >
        {message.content}
      </ReactMarkdown>

      {message.role === "assistant" && (
        <button
          onClick={() => copyToClipboard(message.content)}
          className="absolute top-1 right-1 p-1 rounded hover:bg-gray-600 flex items-center gap-1 text-xs"
          title="Copy message"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" /> Copied!
            </>
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      )}
    </div>
  );
}
