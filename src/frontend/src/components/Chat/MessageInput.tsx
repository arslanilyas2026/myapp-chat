/**
 * MessageInput — WhatsApp-style message input bar.
 * Fixed at the bottom, grows up to 4 lines, mic ↔ send button swap.
 */

import { Mic, Paperclip, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    // Cap at ~4 lines (approx 96px)
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    autoResize();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    // Reset height
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  const hasText = text.trim().length > 0;

  return (
    <div
      className="sticky bottom-0 z-20 flex items-end gap-2 border-t border-border bg-card px-2 py-2 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
      data-ocid="chat.input_bar"
    >
      {/* Attachment button */}
      <button
        type="button"
        className="mb-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
        aria-label={t("chat.attachFile")}
        data-ocid="chat.attach_button"
        // PLACEHOLDER: implement file picker / attachment sheet
        onClick={() => {}}
      >
        <Paperclip size={20} />
      </button>

      {/* Text area */}
      <div className="flex flex-1 items-end rounded-3xl border border-input bg-card px-4 py-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={t("chat.typeMessage")}
          data-ocid="chat.message_input"
          className="max-h-24 w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          aria-label={t("chat.typeMessage")}
        />
      </div>

      {/* Mic / Send button */}
      {hasText ? (
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled}
          aria-label={t("chat.send")}
          data-ocid="chat.send_button"
          className="mb-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-smooth hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      ) : (
        <button
          type="button"
          aria-label={t("chat.recordAudio")}
          data-ocid="chat.mic_button"
          // PLACEHOLDER: implement audio recording
          onClick={() => {}}
          className="mb-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-smooth hover:opacity-90 active:scale-95"
        >
          <Mic size={18} />
        </button>
      )}
    </div>
  );
}

export default MessageInput;
