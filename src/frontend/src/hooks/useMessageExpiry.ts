/**
 * useMessageExpiry — drives disappearing-message timers.
 *
 * Rules (from ADMIN_CONFIG.messageExpiry):
 *   TEXT:       auto-delete after `text` ms from send time
 *   IMAGE:      view-once → delete immediately after isRead becomes true
 *   AUDIO/VIDEO: delete immediately after isPlayed becomes true
 *
 * FIRESTORE: each call to expireMessage should also call:
 *   deleteDoc(doc(db, 'messages', messageId))
 */

import { ADMIN_CONFIG } from "@/config/admin";
import type { Message } from "@/types";
import { MessageType } from "@/types";
import { useEffect, useRef } from "react";

interface UseMessageExpiryOptions {
  messages: Message[];
  expireMessage: (messageId: string) => void;
}

export function useMessageExpiry({
  messages,
  expireMessage,
}: UseMessageExpiryOptions): void {
  // Track which messages already have timers so we don't double-schedule
  const scheduledRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const msg of messages) {
      if (scheduledRef.current.has(msg.id)) continue;

      // ── IMAGE: view-once — expire as soon as it's been read ──
      if (msg.type === MessageType.Image && msg.isViewOnce && msg.isRead) {
        scheduledRef.current.add(msg.id);
        // FIRESTORE: deleteDoc(doc(db, 'messages', msg.id))
        expireMessage(msg.id);
        continue;
      }

      // ── AUDIO / VIDEO: expire immediately after played ──
      if (
        (msg.type === MessageType.Audio || msg.type === MessageType.Video) &&
        msg.isPlayed
      ) {
        scheduledRef.current.add(msg.id);
        // FIRESTORE: deleteDoc(doc(db, 'messages', msg.id))
        expireMessage(msg.id);
        continue;
      }

      // ── TEXT: schedule deletion at expiresAt ──
      if (msg.type === MessageType.Text && msg.expiresAt) {
        const msUntilExpiry = new Date(msg.expiresAt).getTime() - Date.now();
        if (msUntilExpiry <= 0) {
          scheduledRef.current.add(msg.id);
          // FIRESTORE: deleteDoc(doc(db, 'messages', msg.id))
          expireMessage(msg.id);
          continue;
        }
        scheduledRef.current.add(msg.id);
        const timer = setTimeout(
          () => {
            // FIRESTORE: deleteDoc(doc(db, 'messages', msg.id))
            expireMessage(msg.id);
          },
          Math.min(msUntilExpiry, ADMIN_CONFIG.messageExpiry.text),
        );
        return () => clearTimeout(timer);
      }
    }
  }, [messages, expireMessage]);
}

// ─── Countdown helper ─────────────────────────────────────────────────────────

/**
 * Given an expiresAt ISO string, returns a human-readable countdown string
 * such as "1:45" (minutes:seconds) or "0:30". Returns null once expired.
 */
export function formatCountdown(expiresAt: string): string | null {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return null;
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
