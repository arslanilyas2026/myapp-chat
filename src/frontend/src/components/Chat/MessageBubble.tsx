/**
 * MessageBubble — renders a single chat message in WhatsApp style.
 * Handles: text (with countdown), image (view-once), audio, video, expired.
 */

import { formatCountdown } from "@/hooks/useMessageExpiry";
import type { Message } from "@/types";
import { MessageType } from "@/types";
import {
  Check,
  CheckCheck,
  Clock,
  Image as ImageIcon,
  Mic,
  Play,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  onConsume: (messageId: string) => void;
}

// ─── Timestamp formatter ──────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Read receipt icon ────────────────────────────────────────────────────────

function ReadReceipt({ isRead }: { isRead: boolean }) {
  if (isRead) {
    return (
      <CheckCheck size={14} className="text-blue-500" aria-hidden="true" />
    );
  }
  return (
    <Check size={14} className="text-muted-foreground" aria-hidden="true" />
  );
}

// ─── Countdown tick ───────────────────────────────────────────────────────────

function ExpiryCountdown({ expiresAt }: { expiresAt: string }) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(() => formatCountdown(expiresAt));

  useEffect(() => {
    if (!countdown) return;
    const interval = setInterval(() => {
      const next = formatCountdown(expiresAt);
      setCountdown(next);
      if (!next) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, countdown]);

  if (!countdown) return null;
  return (
    <span className="mt-0.5 flex items-center gap-0.5 text-[10px] text-muted-foreground">
      <Clock size={9} aria-hidden="true" />
      {t("chat.disappearsIn", { time: countdown })}
    </span>
  );
}

// ─── Message content renderers ────────────────────────────────────────────────

function TextContent({
  message,
  isSent,
}: { message: Message; isSent: boolean }) {
  return (
    <>
      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
        {message.content}
      </p>
      {message.expiresAt && !isSent && (
        <ExpiryCountdown expiresAt={message.expiresAt} />
      )}
      {message.expiresAt && isSent && (
        <ExpiryCountdown expiresAt={message.expiresAt} />
      )}
    </>
  );
}

function ImageContent({
  message,
  onConsume,
}: {
  message: Message;
  onConsume: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(message.isRead);

  function handleTap() {
    if (!revealed) {
      setRevealed(true);
      onConsume(message.id);
    }
  }

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={handleTap}
        data-ocid="chat.image_tap_button"
        className="flex h-32 w-48 items-center justify-center rounded-lg bg-muted transition-smooth hover:bg-muted/80"
        aria-label={t("chat.tapToView")}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon size={28} />
          <span className="text-xs font-medium">{t("chat.tapToView")}</span>
        </div>
      </button>
    );
  }

  return (
    <img
      src={message.content}
      alt=""
      className="max-h-64 w-full rounded-lg object-cover"
    />
  );
}

// Pre-computed waveform bar heights to avoid array-index key lint errors
const WAVEFORM_BARS: { id: string; height: number }[] = Array.from(
  { length: 18 },
  (_, i) => ({ id: `wb${i}`, height: 8 + Math.sin(i * 0.8) * 6 }),
);

function AudioContent({
  message,
  onConsume,
}: {
  message: Message;
  onConsume: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [played, setPlayed] = useState(message.isPlayed);

  function handlePlay() {
    if (!played) {
      setPlayed(true);
      onConsume(message.id);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      data-ocid="chat.audio_play_button"
      className="flex items-center gap-3 rounded-lg px-1 py-0.5"
      aria-label={t("chat.tapToListen")}
    >
      <div
        className={[
          "flex h-9 w-9 items-center justify-center rounded-full transition-smooth",
          played
            ? "bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground",
        ].join(" ")}
      >
        {played ? <Check size={16} /> : <Play size={16} fill="currentColor" />}
      </div>
      {/* Waveform placeholder */}
      <div className="flex h-5 items-center gap-0.5">
        {WAVEFORM_BARS.map((bar) => (
          <div
            key={bar.id}
            className={[
              "w-0.5 rounded-full transition-smooth",
              played ? "bg-muted-foreground/40" : "bg-primary/60",
            ].join(" ")}
            style={{ height: `${bar.height}px` }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {played ? t("chat.tapToListen") : "0:07"}
      </span>
    </button>
  );
}

function VideoContent({
  message,
  onConsume,
}: {
  message: Message;
  onConsume: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [watched, setWatched] = useState(message.isPlayed);

  function handleWatch() {
    if (!watched) {
      setWatched(true);
      onConsume(message.id);
    }
  }

  return (
    <button
      type="button"
      onClick={handleWatch}
      data-ocid="chat.video_play_button"
      className="relative flex h-32 w-48 items-center justify-center overflow-hidden rounded-lg bg-muted"
      aria-label={t("chat.tapToWatch")}
    >
      <Video size={32} className="text-muted-foreground" />
      {!watched && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-foreground/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/60">
            <Play size={18} fill="white" className="text-card" />
          </div>
          <span className="text-xs font-medium text-card">
            {t("chat.tapToWatch")}
          </span>
        </div>
      )}
    </button>
  );
}

function ExpiredContent() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Clock size={14} aria-hidden="true" />
      <span className="text-sm italic">{t("chat.messageExpired")}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MessageBubble({
  message,
  isSent,
  onConsume,
}: MessageBubbleProps) {
  const { t } = useTranslation();

  // Detect locally expired messages (expiresAt passed but not yet removed from state)
  const isExpiredNow =
    message.expiresAt !== null &&
    new Date(message.expiresAt).getTime() <= Date.now();

  const bubbleBase =
    "relative max-w-[75%] rounded-2xl px-3 py-2 shadow-sm flex flex-col gap-0.5";
  const sentStyle = "bg-[oklch(0.92_0.06_114)] text-foreground rounded-tr-sm";
  const receivedStyle = "bg-card text-foreground rounded-tl-sm";

  return (
    <div
      data-ocid={isSent ? "chat.sent_message" : "chat.received_message"}
      className={[
        "flex w-full",
        isSent ? "justify-end pr-2" : "justify-start pl-2",
      ].join(" ")}
    >
      {/* Tail for received */}
      {!isSent && (
        <div className="relative flex items-end">
          <svg
            className="absolute -left-2 bottom-2 h-4 w-3"
            viewBox="0 0 12 16"
            fill="none"
            aria-hidden="true"
          >
            <path d="M12 16 Q0 10 2 0 L12 0 Z" fill="white" />
          </svg>
        </div>
      )}

      <div
        className={[bubbleBase, isSent ? sentStyle : receivedStyle].join(" ")}
      >
        {isExpiredNow ? (
          <ExpiredContent />
        ) : message.type === MessageType.Text ? (
          <TextContent message={message} isSent={isSent} />
        ) : message.type === MessageType.Image ? (
          <ImageContent message={message} onConsume={onConsume} />
        ) : message.type === MessageType.Audio ? (
          <AudioContent message={message} onConsume={onConsume} />
        ) : (
          <VideoContent message={message} onConsume={onConsume} />
        )}

        {/* Footer: timestamp + read receipt */}
        <div className="flex items-center justify-end gap-1 pt-0.5">
          <span
            className="text-[10px] text-muted-foreground"
            aria-label={t("chat.delivered")}
          >
            {formatTime(message.timestamp)}
          </span>
          {isSent && <ReadReceipt isRead={message.isRead} />}
        </div>
      </div>

      {/* Tail for sent */}
      {isSent && (
        <div className="relative flex items-end">
          <svg
            className="absolute -right-2 bottom-2 h-4 w-3"
            viewBox="0 0 12 16"
            fill="none"
            aria-hidden="true"
          >
            <path d="M0 16 Q12 10 10 0 L0 0 Z" fill="oklch(0.92 0.06 114)" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
