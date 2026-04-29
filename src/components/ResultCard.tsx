"use client";

import { useState } from "react";

interface Props {
  title: string;
  content: string | string[];
  copyable?: boolean;
  highlight?: boolean;
}

export default function ResultCard({ title, content, copyable = false, highlight = false }: Props) {
  const [copied, setCopied] = useState(false);

  const text = Array.isArray(content)
    ? content.map((item, i) => `${i + 1}. ${item}`).join("\n")
    : content;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore
    }
  }

  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-indigo-300 bg-indigo-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs px-2.5 py-1 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      {Array.isArray(content) ? (
        <ul className="space-y-1">
          {content.map((item, i) => (
            <li key={i} className="text-sm text-gray-700 flex gap-2">
              <span className="text-indigo-400 font-semibold shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{content}</p>
      )}
    </div>
  );
}
