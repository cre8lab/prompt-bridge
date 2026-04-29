"use client";

import type { Mode } from "@/lib/types";

const MODES: { value: Mode; label: string; hint: string }[] = [
  { value: "Practical", label: "Practical", hint: "Clear, actionable advice" },
  { value: "Deep", label: "Deep", hint: "Thorough exploration" },
  { value: "Skeptical", label: "Skeptical", hint: "Challenge assumptions" },
  { value: "Beginner-friendly", label: "Beginner-friendly", hint: "Simple explanations" },
  { value: "Technical", label: "Technical", hint: "Code & architecture focus" },
  { value: "Business-focused", label: "Business-focused", hint: "ROI, strategy, risks" },
  { value: "Social Reply + Claude Prompt", label: "Social Reply", hint: "Post + full prompt" },
];

interface Props {
  selected: Mode;
  onChange: (mode: Mode) => void;
}

export default function ModeSelector({ selected, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Mode</label>
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            title={m.hint}
            onClick={() => onChange(m.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              selected === m.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
