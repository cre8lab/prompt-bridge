export default function PrivacyNotice() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500 leading-relaxed">
      <span className="font-semibold text-gray-600">Privacy: </span>
      PromptBridge uses only lightweight context such as your selected mode, prompt length, browser language,
      timezone, and device type to format better prompts. It does not require login, does not store your raw
      prompts, does not use hidden identity enrichment, and does not use invasive browser fingerprinting.
      Preferences may be saved locally in your browser and can be cleared anytime.
    </div>
  );
}
