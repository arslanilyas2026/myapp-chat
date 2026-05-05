/**
 * Core TypeScript types for the MyApp chat application.
 * All backend/Firebase data structures are defined here.
 */

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum MessageType {
  Text = "text",
  Image = "image",
  Audio = "audio",
  Video = "video",
}

export type AppLanguage = "en" | "es" | "pt";

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  /** Firebase UID */
  uid: string;
  /** E.164 format, e.g. +15550001234 */
  phoneNumber: string;
  displayName: string;
  avatarUrl: string | null;
  isOnline: boolean;
  /** ISO 8601 timestamp */
  lastSeen: string;
}

// ─── Message ─────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  /** Text content or storage URL for media */
  content: string;
  /** Firestore Timestamp as ISO string */
  timestamp: string;
  isRead: boolean;
  /** ISO timestamp after which this message auto-deletes; null = never */
  expiresAt: string | null;
  /** If true, deleted after first view/listen/watch */
  isViewOnce: boolean;
  /** Audio/video: true after the media has been played */
  isPlayed: boolean;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface Chat {
  id: string;
  /** UIDs of all participants */
  participants: string[];
  lastMessage: Message | null;
  unreadCount: number;
  /** ISO timestamp of last activity */
  updatedAt: string;
}

// ─── Translation ─────────────────────────────────────────────────────────────

export interface TranslationResult {
  translatedText: string;
  detectedLanguage: string;
  /** Which service fulfilled the request */
  service: "myMemory" | "libreTranslate" | "deepL";
}

// ─── Auth State ───────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
