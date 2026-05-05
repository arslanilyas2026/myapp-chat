/**
 * useChats — real-time chat list hook
 *
 * FIRESTORE: Replace mock with real subscription when Firebase is configured.
 * ADMIN: Firestore security rules must allow users to read their own chats.
 */

import { useEffect, useState } from "react";
import type { Chat } from "../types";
import { MessageType } from "../types";

// ─── Mock data ────────────────────────────────────────────────────────────────
// MOCK: Remove this block and uncomment the Firestore subscription below
//       when Firebase Auth and Firestore are configured.
const MOCK_CHATS: Chat[] = [
  {
    id: "1",
    participants: ["currentUser", "alice"],
    lastMessage: {
      id: "m1",
      chatId: "1",
      senderId: "alice",
      type: MessageType.Text,
      content: "Hey! Are you free this weekend? 😊",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false,
      expiresAt: null,
      isViewOnce: false,
      isPlayed: false,
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    participants: ["currentUser", "bob"],
    lastMessage: {
      id: "m2",
      chatId: "2",
      senderId: "currentUser",
      type: MessageType.Text,
      content: "Sounds great! Let me check my schedule.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      expiresAt: null,
      isViewOnce: false,
      isPlayed: false,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    participants: ["currentUser", "carol", "david"],
    lastMessage: {
      id: "m3",
      chatId: "3",
      senderId: "carol",
      type: MessageType.Audio,
      content: "",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      expiresAt: null,
      isViewOnce: false,
      isPlayed: false,
    },
    unreadCount: 5,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    participants: ["currentUser", "emma"],
    lastMessage: {
      id: "m4",
      chatId: "4",
      senderId: "currentUser",
      type: MessageType.Video,
      content: "",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      expiresAt: null,
      isViewOnce: false,
      isPlayed: true,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/** Display name for each participant UID (mock — replace with Firestore user lookup) */
export const MOCK_USER_NAMES: Record<string, string> = {
  currentUser: "You",
  alice: "Alice Ferreira",
  bob: "Bob Santos",
  carol: "Carol Lima",
  david: "David Mendes",
  emma: "Emma Oliveira",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseChatsReturn {
  chats: Chat[];
  loading: boolean;
  error: string | null;
}

export function useChats(): UseChatsReturn {
  // Return mock data immediately — no async delay, no Firebase calls.
  // FIRESTORE: Replace this with a real Firestore subscription when Firebase is configured.
  return { chats: MOCK_CHATS, loading: false, error: null };
}
