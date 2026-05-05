/**
 * Translation Service — 3-tier fallback chain
 *
 * Priority order:
 *   1. MyMemory   (free, no key required for basic tier)
 *   2. LibreTranslate  (self-hosted or public instance)
 *   3. DeepL           (paid, highest quality)
 *
 * ADMIN: Set API keys in the .env file:
 *   VITE_MYMEMORY_API_KEY
 *   VITE_LIBRETRANSLATE_API_KEY  /  VITE_LIBRETRANSLATE_ENDPOINT
 *   VITE_DEEPL_API_KEY           (use VITE_DEEPL_ENDPOINT for paid tier)
 */

import { TRANSLATION_CONFIG } from "../config/translation";
import type { TranslationResult } from "../types";

// ─── Language code helpers ────────────────────────────────────────────────────

type TranslationService = "myMemory" | "libreTranslate" | "deepL";

/**
 * Maps the app's i18next language codes to service-specific codes.
 * - MyMemory  : lowercase  (en, es, pt)
 * - LibreTranslate: lowercase  (en, es, pt)
 * - DeepL     : UPPERCASE  (EN, ES, PT)
 */
export function mapLanguageCode(
  appLang: string,
  service: TranslationService,
): string {
  const lower = appLang.toLowerCase();
  if (service === "deepL") return lower.toUpperCase();
  return lower;
}

// ─── Custom error ─────────────────────────────────────────────────────────────

export class TranslationError extends Error {
  constructor(
    message: string,
    public readonly service: TranslationService | "all",
  ) {
    super(message);
    this.name = "TranslationError";
  }
}

// ─── Tier 1: MyMemory ─────────────────────────────────────────────────────────

async function translateWithMyMemory(
  text: string,
  targetLang: string,
): Promise<TranslationResult> {
  const { apiKey, endpoint } = TRANSLATION_CONFIG.myMemory;
  const lang = mapLanguageCode(targetLang, "myMemory");

  const params = new URLSearchParams({
    q: text,
    langpair: `auto|${lang}`,
    ...(apiKey ? { key: apiKey } : {}),
  });

  const res = await fetch(`${endpoint}?${params.toString()}`);
  if (!res.ok)
    throw new TranslationError(`MyMemory HTTP ${res.status}`, "myMemory");

  const json = (await res.json()) as {
    responseData: { translatedText: string; detectedLanguage?: string };
    responseStatus: number;
    responseDetails?: string;
  };

  if (json.responseStatus !== 200) {
    throw new TranslationError(
      json.responseDetails ?? "MyMemory error",
      "myMemory",
    );
  }

  // DEV: Translation used service: myMemory
  console.debug("[Translation] used service: myMemory");

  return {
    translatedText: json.responseData.translatedText,
    detectedLanguage: json.responseData.detectedLanguage ?? "unknown",
    service: "myMemory",
  };
}

// ─── Tier 2: LibreTranslate ───────────────────────────────────────────────────

async function translateWithLibreTranslate(
  text: string,
  targetLang: string,
): Promise<TranslationResult> {
  const { apiKey, endpoint } = TRANSLATION_CONFIG.libreTranslate;
  const lang = mapLanguageCode(targetLang, "libreTranslate");

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "auto",
      target: lang,
      api_key: apiKey,
    }),
  });

  if (!res.ok)
    throw new TranslationError(
      `LibreTranslate HTTP ${res.status}`,
      "libreTranslate",
    );

  const json = (await res.json()) as {
    translatedText: string;
    detectedLanguage?: { confidence: number; language: string };
    error?: string;
  };

  if (json.error) {
    throw new TranslationError(json.error, "libreTranslate");
  }

  // DEV: Translation used service: libreTranslate
  console.debug("[Translation] used service: libreTranslate");

  return {
    translatedText: json.translatedText,
    detectedLanguage: json.detectedLanguage?.language ?? "unknown",
    service: "libreTranslate",
  };
}

// ─── Tier 3: DeepL ────────────────────────────────────────────────────────────

async function translateWithDeepL(
  text: string,
  targetLang: string,
): Promise<TranslationResult> {
  const { apiKey, endpoint } = TRANSLATION_CONFIG.deepL;
  const lang = mapLanguageCode(targetLang, "deepL");

  const body = new FormData();
  body.append("auth_key", apiKey);
  body.append("text", text);
  body.append("target_lang", lang);

  const res = await fetch(endpoint, { method: "POST", body });
  if (!res.ok) throw new TranslationError(`DeepL HTTP ${res.status}`, "deepL");

  const json = (await res.json()) as {
    translations: Array<{ text: string; detected_source_language: string }>;
    message?: string;
  };

  if (!json.translations?.length) {
    throw new TranslationError(json.message ?? "DeepL empty response", "deepL");
  }

  // DEV: Translation used service: deepL
  console.debug("[Translation] used service: deepL");

  return {
    translatedText: json.translations[0].text,
    detectedLanguage:
      json.translations[0].detected_source_language.toLowerCase(),
    service: "deepL",
  };
}

// ─── Main export: ordered fallback chain ──────────────────────────────────────

/**
 * Translates `text` to `targetLang` using a 3-tier fallback:
 * MyMemory → LibreTranslate → DeepL.
 *
 * Throws {@link TranslationError} with `service: 'all'` when every tier fails.
 */
export async function translateMessage(
  text: string,
  targetLang: string,
): Promise<TranslationResult> {
  const tiers: Array<() => Promise<TranslationResult>> = [
    () => translateWithMyMemory(text, targetLang),
    () => translateWithLibreTranslate(text, targetLang),
    () => translateWithDeepL(text, targetLang),
  ];

  const errors: string[] = [];

  for (const tier of tiers) {
    try {
      return await tier();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Translation] tier failed: ${msg}`);
      errors.push(msg);
    }
  }

  throw new TranslationError(
    `All translation services failed: ${errors.join(" | ")}`,
    "all",
  );
}
