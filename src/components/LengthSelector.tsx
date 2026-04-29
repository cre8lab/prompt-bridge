"use client";

import type { Length } from "@/lib/types";

const LENGTHS: { value: Length; label: string; hint: string }[] = [
  { value: "Short", label: "Short", hint: "Concise output" },
  { value: "Balanced", label: "Balanced", hint: "Default depth" },
  { value: "Detailed", label: "Detailed", hint: "Comprehensive output" },
];

interface Props {
  selected: Length;
  onChange: (length: Length) => void;
}

export default function LengthSelector({ selected, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Length</label>
      <div className="flex gap-2">
        {LENGTHS.map((l) => (
          <button
            key={l.value}
            type="button"
            title={l.hint}
            onClick={() => onChange(l.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              selected === l.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
