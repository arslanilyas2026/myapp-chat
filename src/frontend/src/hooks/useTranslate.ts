/**
 * useTranslate
 *
 * Hook for tap-to-translate feature on individual messages.
 * Named `useTranslate` (not `useTranslation`) to avoid conflict with react-i18next.
 *
 * Usage:
 *   const { translatedText, isTranslating, error, isTranslated, translate, showOriginal } =
 *     useTranslate();
 *
 *   // On user tap:
 *   translate(message.content);
 *
 *   // To reset:
 *   showOriginal();
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  TranslationError,
  translateMessage,
} from "../services/translationService";
import type { TranslationResult } from "../types";

// ─── State shape ──────────────────────────────────────────────────────────────

interface TranslateState {
  translatedText: string | null;
  detectedLanguage: string | null;
  service: TranslationResult["service"] | null;
  isTranslating: boolean;
  isTranslated: boolean;
  error: string | null;
}

const INITIAL_STATE: TranslateState = {
  translatedText: null,
  detectedLanguage: null,
  service: null,
  isTranslating: false,
  isTranslated: false,
  error: null,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseTranslateReturn extends TranslateState {
  /** Translate `text` into the user's current app language. */
  translate: (text: string, targetLang?: string) => Promise<void>;
  /** Reset back to the original message text. */
  showOriginal: () => void;
}

export function useTranslate(): UseTranslateReturn {
  const { i18n } = useTranslation();
  const [state, setState] = useState<TranslateState>(INITIAL_STATE);

  const translate = useCallback(
    async (text: string, targetLang?: string) => {
      // Use explicitly passed target or fall back to the current app language
      const lang = targetLang ?? i18n.language ?? "en";

      setState({
        ...INITIAL_STATE,
        isTranslating: true,
      });

      try {
        const result = await translateMessage(text, lang);
        setState({
          translatedText: result.translatedText,
          detectedLanguage: result.detectedLanguage,
          service: result.service,
          isTranslating: false,
          isTranslated: true,
          error: null,
        });
      } catch (err) {
        const msg =
          err instanceof TranslationError ? err.message : "Translation failed";
        setState({
          ...INITIAL_STATE,
          error: msg,
        });
      }
    },
    [i18n.language],
  );

  const showOriginal = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return { ...state, translate, showOriginal };
}
