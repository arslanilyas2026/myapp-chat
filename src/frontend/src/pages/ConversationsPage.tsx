/**
 * ConversationsPage — WhatsApp-style chat list (home screen)
 *
 * Features:
 * - Dark-green header with title + action icons
 * - Collapsible search bar
 * - Chat rows with avatar, name, last message preview, timestamp, unread badge
 * - Loading skeletons (3 rows)
 * - Empty state with icon + localized text
 * - Floating Action Button (FAB) for future new-chat flow
 */

import {
  MessageSquareDashed,
  Mic,
  MoreVertical,
  Pencil,
  Search,
  Video,
} from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/Layout/AppLayout";
import { MOCK_USER_NAMES, useChats } from "../hooks/useChats";
import type { Chat, Message } from "../types";
import { MessageType } from "../types";

// ─── Helpers ────────────────────────────────────────────────────────────────

const CURRENT_USER_ID = "currentUser"; // MOCK: Replace with auth.currentUser.uid

/** Avatar background colors keyed by first letter */
const AVATAR_COLORS: Record<string, string> = {
  A: "#0a7aff",
  B: "#ff5f57",
  C: "#28ca41",
  D: "#febc2e",
  E: "#7f53ac",
  F: "#0a7aff",
  G: "#ff5f57",
  H: "#28ca41",
  I: "#febc2e",
  J: "#7f53ac",
  K: "#0a7aff",
  L: "#ff5f57",
  M: "#28ca41",
  N: "#febc2e",
  O: "#7f53ac",
  P: "#0a7aff",
  Q: "#ff5f57",
  R: "#28ca41",
  S: "#febc2e",
  T: "#7f53ac",
  U: "#0a7aff",
  V: "#ff5f57",
  W: "#28ca41",
  X: "#febc2e",
  Y: "#7f53ac",
  Z: "#0a7aff",
};

function getAvatarColor(name: string): string {
  const letter = name.charAt(0).toUpperCase();
  return AVATAR_COLORS[letter] ?? "#888";
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/** Return the display name for a chat: other participant or group name */
function getChatName(chat: Chat): string {
  const others = chat.participants.filter((uid) => uid !== CURRENT_USER_ID);
  if (others.length === 1) return MOCK_USER_NAMES[others[0]] ?? others[0];
  return others
    .map((uid) => (MOCK_USER_NAMES[uid] ?? uid).split(" ")[0])
    .join(", ");
}

/** Relative timestamp: same-day → time, yesterday, this-week → day name, older → date */
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(date);
  }
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date);
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function ChatAvatar({ name }: { name: string }) {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ backgroundColor: getAvatarColor(name) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

function LastMessagePreview({
  msg,
  t,
}: { msg: Message; t: (k: string) => string }) {
  if (msg.type === MessageType.Audio) {
    return (
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <Mic size={13} className="shrink-0" />
        {t("conversations.voiceMessage")}
      </span>
    );
  }
  if (msg.type === MessageType.Video) {
    return (
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <Video size={13} className="shrink-0" />
        {t("conversations.videoMessage")}
      </span>
    );
  }
  return (
    <span className="line-clamp-1 text-sm text-muted-foreground">
      {msg.content}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-muted" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3.5 w-36 animate-pulse rounded bg-muted" />
        <div className="h-3 w-52 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-3 w-10 animate-pulse rounded bg-muted" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConversationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { chats, loading } = useChats();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredChats = query.trim()
    ? chats.filter((c) => {
        const name = getChatName(c).toLowerCase();
        const msg = c.lastMessage?.content?.toLowerCase() ?? "";
        const q = query.toLowerCase();
        return name.includes(q) || msg.includes(q);
      })
    : chats;

  function handleSearchToggle() {
    setSearchOpen((prev) => {
      if (!prev) setTimeout(() => searchRef.current?.focus(), 50);
      else setQuery("");
      return !prev;
    });
  }

  const conversationsHeader = (
    <header
      className="sticky top-0 z-30 px-4 pb-1 pt-3"
      style={{ backgroundColor: "oklch(0.28 0.10 163)" }}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold tracking-wide text-white">
          {t("conversations.title")}
        </h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={t("conversations.search")}
            data-ocid="conversations.search_button"
            onClick={handleSearchToggle}
            className="rounded-full p-2 text-white transition-colors duration-150 hover:bg-white/10 active:bg-white/20"
          >
            <Search size={20} />
          </button>
          <button
            type="button"
            aria-label="Menu"
            data-ocid="conversations.menu_button"
            className="rounded-full p-2 text-white transition-colors duration-150 hover:bg-white/10 active:bg-white/20"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Search bar — slides down when searchOpen */}
      <div
        className={[
          "overflow-hidden transition-all duration-200",
          searchOpen ? "max-h-14 opacity-100 py-2" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5">
          <Search
            size={15}
            className="shrink-0 text-white/70"
            aria-hidden="true"
          />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("conversations.search")}
            data-ocid="conversations.search_input"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/60 outline-none"
          />
        </div>
      </div>
    </header>
  );

  return (
    <AppLayout header={conversationsHeader}>
      {/* ── Chat List ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          // Skeleton rows
          <div data-ocid="conversations.loading_state">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : filteredChats.length === 0 ? (
          // Empty state
          <div
            data-ocid="conversations.empty_state"
            className="flex flex-col items-center justify-center gap-4 px-8 py-24 text-center"
          >
            <MessageSquareDashed
              size={60}
              strokeWidth={1.2}
              className="text-muted-foreground opacity-40"
            />
            <p className="font-semibold text-foreground">
              {t("conversations.noConversations")}
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              {t("conversations.noConversationsHint")}
            </p>
          </div>
        ) : (
          // Chat rows
          <ul data-ocid="conversations.list">
            {filteredChats.map((chat, index) => {
              const name = getChatName(chat);
              const hasUnread = chat.unreadCount > 0;
              const timeStr = chat.updatedAt ? formatTime(chat.updatedAt) : "";

              return (
                <li key={chat.id}>
                  <button
                    type="button"
                    data-ocid={`conversations.item.${index + 1}`}
                    onClick={() => navigate(`/chat/${chat.id}`)}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors duration-100 hover:bg-muted/60 active:bg-muted"
                  >
                    {/* Avatar */}
                    <ChatAvatar name={name} />

                    {/* Center: name + last message */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span
                        className={[
                          "truncate text-[0.9375rem] leading-snug",
                          hasUnread
                            ? "font-semibold text-foreground"
                            : "font-medium text-foreground",
                        ].join(" ")}
                      >
                        {name}
                      </span>
                      {chat.lastMessage && (
                        <div className="mt-0.5 min-w-0 truncate">
                          <LastMessagePreview msg={chat.lastMessage} t={t} />
                        </div>
                      )}
                    </div>

                    {/* Right: timestamp + unread badge */}
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={[
                          "text-xs",
                          hasUnread ? "font-semibold" : "text-muted-foreground",
                        ].join(" ")}
                        style={
                          hasUnread
                            ? { color: "oklch(0.42 0.13 163)" }
                            : undefined
                        }
                      >
                        {timeStr}
                      </span>
                      {hasUnread && (
                        <span
                          className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[0.6875rem] font-bold text-white"
                          style={{ backgroundColor: "oklch(0.42 0.13 163)" }}
                          data-ocid={`conversations.unread_badge.${index + 1}`}
                        >
                          {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Divider (skip last item) */}
                  {index < filteredChats.length - 1 && (
                    <div
                      className="ml-[4.25rem] h-px bg-border"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── FAB (new chat) ──────────────────────────────────────── */}
      <button
        type="button"
        aria-label={t("conversations.newChat")}
        data-ocid="conversations.new_chat_button"
        className="fixed bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95"
        style={{ backgroundColor: "oklch(0.55 0.17 163)" }}
      >
        <Pencil size={22} className="text-white" />
      </button>
    </AppLayout>
  );
}
