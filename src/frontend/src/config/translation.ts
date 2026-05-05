/**
 * Translation API Configuration
 *
 * ADMIN: Add your translation API keys in the .env file.
 * The translation service uses a fallback chain:
 *   1. MyMemory  (free tier, no key required for basic use)
 *   2. LibreTranslate  (self-hosted or public instance)
 *   3. DeepL  (paid, highest quality)
 *
 * If one service fails, the next is tried automatically.
 */

export const TRANSLATION_CONFIG = {
  /** MyMemory — free tier available, optional key for higher limits */
  myMemory: {
    apiKey: import.meta.env.VITE_MYMEMORY_API_KEY ?? "", // ADMIN: Add your MyMemory API key here (optional)
    endpoint: "https://api.mymemory.translated.net/get",
  },

  /** LibreTranslate — self-hosted or public instance */
  libreTranslate: {
    apiKey: import.meta.env.VITE_LIBRETRANSLATE_API_KEY ?? "", // ADMIN: Add your LibreTranslate API key here
    endpoint:
      import.meta.env.VITE_LIBRETRANSLATE_ENDPOINT ??
      "https://libretranslate.com/translate", // ADMIN: Update if self-hosting
  },

  /** DeepL — requires a paid API plan */
  deepL: {
    apiKey: import.meta.env.VITE_DEEPL_API_KEY ?? "", // ADMIN: Add your DeepL API key here
    endpoint: "https://api-free.deepl.com/v2/translate", // ADMIN: Change to api.deepl.com for paid tier
  },
} as const;
