"use client";

import { Sun, Moon } from "lucide-react";

export default function ChatHeader({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}) {
  return (
    <div className="flex justify-around p-2 border-b border-gray-700">
        <h1 className="p-2 rounded-2xl text-2xl bg-gray hover:bg-gray-600  font-bold">AI <span className="text-fuchsia-700"> ASSITANT</span></h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-1 rounded-xl bg-gray-700 hover:bg-gray-600 text-white"
      >
        {darkMode ? <Sun className="w-8 h-4" /> : <Moon className="w-8 h-4" />}
      </button>
    </div>
  );
}
