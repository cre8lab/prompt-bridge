"use client";

import { useState, useCallback } from "react";
import ModeSelector from "@/components/ModeSelector";
import LengthSelector from "@/components/LengthSelector";
import ResultCard from "@/components/ResultCard";
import PrivacyNotice from "@/components/PrivacyNotice";
import { buildContextCard, clearPreferences } from "@/lib/contextCard";
import type { Mode, Length, GenerateResult } from "@/lib/types";

const MAX_CHARS = 4000;

export default function Home() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("Practical");
  const [length, setLength] = useState<Length>("Balanced");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [prefCleared, setPrefCleared] = useState(false);

  const handleGenerate = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please enter some text before generating.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const contextCard = buildContextCard(mode, length);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawQuestion: trimmed, contextCard }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult(data as GenerateResult);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [input, mode, length]);

  function handleClearPrefs() {
    clearPreferences();
    setPrefCleared(true);
    setTimeout(() => setPrefCleared(false), 2000);
  }

  const charsLeft = MAX_CHARS - input.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-indigo-700 tracking-tight">PromptBridge</h1>
          <p className="text-gray-600 text-sm leading-relaxed max-w-lg mx-auto">
            Paste a messy question, post, note, or idea. PromptBridge turns it into a clean
            Claude-ready prompt you can review and copy.
          </p>
        </header>

        {/* Input card */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div>
            <label htmlFor="raw-input" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Your input
            </label>
            <textarea
              id="raw-input"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Paste a rough question, social post, idea, notes, or anything messy…"
              rows={6}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y leading-relaxed"
            />
            <p className={`text-xs mt-1 text-right ${charsLeft < 200 ? "text-orange-500" : "text-gray-400"}`}>
              {charsLeft.toLocaleString()} characters remaining
            </p>
          </div>

          <ModeSelector selected={mode} onChange={setMode} />
          <LengthSelector selected={length} onChange={setLength} />

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || input.trim().length === 0}
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {loading ? "Generating…" : "Generate"}
          </button>

          {loading && (
            <p className="text-center text-xs text-gray-400 animate-pulse">
              Cleaning up your input and building prompts…
            </p>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </section>

        {/* Results */}
        {result && (
          <section id="results" className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Results</h2>

            <ResultCard title="Cleaned-up Intent" content={result.cleaned_intent} />
            <ResultCard title="Assumptions" content={result.assumptions} />
            <ResultCard
              title="Public / Social Reply"
              content={result.social_reply}
              copyable
              highlight
            />
            <ResultCard
              title="Full Claude Prompt"
              content={result.claude_prompt}
              copyable
              highlight
            />
            <ResultCard
              title="Shorter Claude Prompt"
              content={result.short_version}
              copyable
            />
            <ResultCard title="Suggested Adjustments" content={result.suggested_adjustments} />
          </section>
        )}

        {/* Footer */}
        <footer className="space-y-3">
          <PrivacyNotice />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleClearPrefs}
              className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 focus:outline-none"
            >
              {prefCleared ? "Preferences cleared" : "Clear local preferences"}
            </button>
          </div>
        </footer>

      </div>
    </main>
  );
}
