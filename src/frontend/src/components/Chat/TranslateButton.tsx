/**
 * TranslateButton
 *
 * Tap-to-translate control rendered below a chat message's text content.
 *
 * States:
 *   idle       — shows a small "Translate" link
 *   loading    — spinner + "Translating..."
 *   translated — shows translated text + "Show original" link
 *   error      — shows "Translation failed" in muted red
 *
 * All labels come from i18next (chat namespace).
 */

import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTranslate } from "../../hooks/useTranslate";

// ─── Props ────────────────────────────────────────────────────────────────────

interface TranslateButtonProps {
  /** The original message text to translate. */
  text: string;
  /** Optional explicit target language; defaults to the user's app language. */
  targetLang?: string;
  /** Extra Tailwind classes for the outer wrapper. */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TranslateButton({
  text,
  targetLang,
  className = "",
}: TranslateButtonProps) {
  const { t } = useTranslation();
  const {
    translatedText,
    isTranslating,
    isTranslated,
    error,
    translate,
    showOriginal,
  } = useTranslate();

  // ── Idle state ──────────────────────────────────────────────────────────────
  if (!isTranslating && !isTranslated && !error) {
    return (
      <div className={`flex items-center mt-1 ${className}`}>
        <button
          type="button"
          data-ocid="translate.button"
          onClick={() => void translate(text, targetLang)}
          className="text-xs text-primary/70 hover:text-primary underline underline-offset-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          aria-label={t("chat.translate")}
        >
          {t("chat.translate")}
        </button>
      </div>
    );
  }

  // ── Loading state ───────────────────────────────────────────────────────────
  if (isTranslating) {
    return (
      <div
        className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${className}`}
        data-ocid="translate.loading_state"
        aria-live="polite"
        aria-label={t("chat.translating")}
      >
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
        <span>{t("chat.translating")}</span>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className={`flex items-center gap-2 mt-1 ${className}`}>
        <span
          className="text-xs text-destructive/80"
          data-ocid="translate.error_state"
          role="alert"
        >
          {t("chat.translationFailed")}
        </span>
        <button
          type="button"
          data-ocid="translate.retry_button"
          onClick={() => void translate(text, targetLang)}
          className="text-xs text-primary/70 hover:text-primary underline underline-offset-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  // ── Translated state ─────────────────────────────────────────────────────────
  return (
    <div className={`mt-1.5 ${className}`} data-ocid="translate.success_state">
      {/* Divider */}
      <div className="h-px bg-border/50 mb-1.5" aria-hidden="true" />

      {/* Translated text */}
      <p
        className="text-sm text-foreground/90 leading-relaxed"
        data-ocid="translate.translated_text"
        lang={targetLang}
      >
        {translatedText}
      </p>

      {/* Show original link */}
      <button
        type="button"
        data-ocid="translate.show_original_button"
        onClick={showOriginal}
        className="mt-1 text-xs text-primary/70 hover:text-primary underline underline-offset-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
        aria-label={t("chat.showOriginal")}
      >
        {t("chat.showOriginal")}
      </button>
    </div>
  );
}

export default TranslateButton;
