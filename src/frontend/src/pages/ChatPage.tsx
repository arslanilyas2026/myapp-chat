/**
 * ChatPage — full WhatsApp-style chat screen.
 *
 * Route: /chat/:chatId
 * Layout: sticky header (dark green) → scrollable messages → sticky input bar.
 */

import { MessageBubble } from "@/components/Chat/MessageBubble";
import { MessageInput } from "@/components/Chat/MessageInput";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useMessageExpiry } from "@/hooks/useMessageExpiry";
import { useMessages } from "@/hooks/useMessages";
import { ArrowLeft, Phone, Video } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// ─── Mock current user ───────────────────────────────────────────────────────
// FIRESTORE: Replace with real auth.currentUser.uid
const CURRENT_USER_ID = "me";

// ─── Mock contact data ───────────────────────────────────────────────────────
// FIRESTORE: fetch from Firestore users/{uid} document
const MOCK_CONTACT = {
  name: "Liam Chen",
  avatarInitials: "LC",
  isOnline: true,
  lastSeen: "",
};

// ─── Date divider helpers ─────────────────────────────────────────────────────

function getDateLabel(iso: string, t: (key: string) => string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return t("chat.today");
  if (date.toDateString() === yesterday.toDateString())
    return t("chat.yesterday");
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function shouldShowDivider(
  current: string,
  previous: string | undefined,
): boolean {
  if (!previous) return true;
  return new Date(current).toDateString() !== new Date(previous).toDateString();
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function MessageSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 px-4 py-3"
      data-ocid="chat.loading_state"
    >
      {(["s1", "s2", "s3", "s4", "s5"] as const).map((id, i) => (
        <div
          key={id}
          className={[
            "flex",
            i % 2 !== 0 ? "justify-end" : "justify-start",
          ].join(" ")}
        >
          <Skeleton
            className={["h-10 rounded-2xl", i % 2 === 0 ? "w-48" : "w-36"].join(
              " ",
            )}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Chat Header ──────────────────────────────────────────────────────────────

function ChatHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-2 py-2"
      style={{ backgroundColor: "oklch(0.28 0.10 163)" }}
      data-ocid="chat.header"
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label={t("common.back")}
        data-ocid="chat.back_button"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-accent-foreground transition-smooth hover:bg-white/10"
      >
        <ArrowLeft size={22} />
      </button>

      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold"
        aria-hidden="true"
      >
        {MOCK_CONTACT.avatarInitials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-accent-foreground">
          {MOCK_CONTACT.name}
        </p>
        <p className="text-xs text-accent-foreground/70">
          {MOCK_CONTACT.isOnline
            ? t("conversations.online")
            : t("conversations.lastSeen", { time: MOCK_CONTACT.lastSeen })}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Voice call"
          data-ocid="chat.voice_call_button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-accent-foreground transition-smooth hover:bg-white/10"
        >
          <Phone size={20} />
        </button>
        <button
          type="button"
          aria-label="Video call"
          data-ocid="chat.video_call_button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-accent-foreground transition-smooth hover:bg-white/10"
        >
          <Video size={20} />
        </button>
      </div>
    </header>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { chatId = "demo-chat" } = useParams<{ chatId: string }>();
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage, markConsumed, expireMessage } =
    useMessages(chatId);

  useMessageExpiry({ messages, expireMessage });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  function handleSend(text: string) {
    sendMessage(text, CURRENT_USER_ID);
  }

  return (
    <AppLayout header={<ChatHeader />} showNav={false}>
      <div
        className="flex flex-1 flex-col"
        style={{
          background: "oklch(0.96 0.01 150)",
          backgroundImage:
            "radial-gradient(circle, oklch(0.88 0.04 60 / 0.35) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          minHeight: "calc(100vh - 60px)",
        }}
        data-ocid="chat.messages_area"
      >
        {isLoading ? (
          <MessageSkeleton />
        ) : (
          <div className="flex flex-col gap-1 px-1 pb-2 pt-3">
            {messages.map((msg, index) => {
              const prevTimestamp =
                index > 0 ? messages[index - 1].timestamp : undefined;
              const showDivider = shouldShowDivider(
                msg.timestamp,
                prevTimestamp,
              );
              return (
                <div key={msg.id}>
                  {showDivider && (
                    <div
                      className="my-2 flex justify-center"
                      data-ocid="chat.date_divider"
                    >
                      <span className="rounded-full bg-[oklch(0.88_0.04_60_/_0.7)] px-3 py-0.5 text-[11px] font-medium text-foreground/70 shadow-sm">
                        {getDateLabel(msg.timestamp, t)}
                      </span>
                    </div>
                  )}
                  <MessageBubble
                    message={msg}
                    isSent={msg.senderId === CURRENT_USER_ID}
                    onConsume={markConsumed}
                  />
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      <MessageInput onSend={handleSend} />
    </AppLayout>
  );
}
