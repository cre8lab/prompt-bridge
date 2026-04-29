import type { ContextCard, Mode, Length } from "./types";

function getDeviceClass(): ContextCard["deviceClass"] {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getStoredPreferences(): string[] {
  try {
    const raw = localStorage.getItem("pb_preferences");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function buildContextCard(mode: Mode, length: Length): ContextCard {
  return {
    deviceClass: getDeviceClass(),
    browserLanguage: navigator.language || "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    selectedMode: mode,
    selectedLength: length,
    pageCategory: "prompt_builder",
    anonymousPreferences: getStoredPreferences(),
  };
}

export function clearPreferences(): void {
  localStorage.removeItem("pb_preferences");
}
