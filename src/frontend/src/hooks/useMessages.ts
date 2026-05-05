/**
 * useMessages — subscribes to messages for a given chatId.
 *
 * FIRESTORE: Replace the mock data and mutation stubs with real Firestore calls:
 *   - Subscribe:  onSnapshot(query(collection(db, 'messages'), where('chatId', '==', chatId), orderBy('timestamp')), ...)
 *   - Send:       addDoc(collection(db, 'messages'), { chatId, senderId, type, content, timestamp: serverTimestamp(), isRead: false, isPlayed: false, isViewOnce, expiresAt })
 */

import { ADMIN_CONFIG } from "@/config/admin";
import type { Message } from "@/types";
import { MessageType } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Mock seed data ───────────────────────────────────────────────────────────

const now = new Date();
const mins = (n: number) => new Date(now.getTime() - n * 60_000).toISOString();
const future = (ms: number) => new Date(now.getTime() + ms).toISOString();

const MOCK_MESSAGES: Message[] = [
  {
    id: "msg-1",
    chatId: "demo-chat",
    senderId: "contact-uid",
    type: MessageType.Text,
    content: "Hey, ready for the call at 2?",
    timestamp: mins(8),
    isRead: true,
    expiresAt: future(ADMIN_CONFIG.messageExpiry.text),
    isViewOnce: false,
    isPlayed: false,
  },
  {
    id: "msg-2",
    chatId: "demo-chat",
    senderId: "me",
    type: MessageType.Text,
    content: "Yes, ready! 2 PM works for me.",
    timestamp: mins(6),
    isRead: true,
    expiresAt: future(ADMIN_CONFIG.messageExpiry.text),
    isViewOnce: false,
    isPlayed: false,
  },
  {
    id: "msg-3",
    chatId: "demo-chat",
    senderId: "contact-uid",
    type: MessageType.Audio,
    content: "",
    timestamp: mins(4),
    isRead: false,
    expiresAt: null,
    isViewOnce: false,
    isPlayed: false,
  },
  {
    id: "msg-4",
    chatId: "demo-chat",
    senderId: "me",
    type: MessageType.Text,
    content: "Okay, perfect! See you then.",
    timestamp: mins(2),
    isRead: true,
    expiresAt: future(ADMIN_CONFIG.messageExpiry.text),
    isViewOnce: false,
    isPlayed: false,
  },
  {
    id: "msg-5",
    chatId: "demo-chat",
    senderId: "contact-uid",
    type: MessageType.Image,
    content:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    timestamp: mins(1),
    isRead: false,
    expiresAt: null,
    isViewOnce: true,
    isPlayed: false,
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  /** Send a new text message. Returns the new message id. */
  sendMessage: (text: string, currentUserId: string) => string;
  /** Mark a message as read/played in local state */
  markConsumed: (messageId: string) => void;
  /** Remove a message from local state (called by useMessageExpiry) */
  expireMessage: (messageId: string) => void;
}

export function useMessages(chatId: string): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // FIRESTORE: Replace with real onSnapshot subscription:
    // const q = query(collection(db, 'messages'), where('chatId', '==', chatId), orderBy('timestamp'));
    // const unsub = onSnapshot(q, (snap) => {
    //   setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Message));
    //   setIsLoading(false);
    // });
    // return () => unsub();

    // ── Mock: load seed messages for this chatId ──
    const filtered = MOCK_MESSAGES.filter(
      (m) => m.chatId === chatId || chatId === "demo-chat",
    );
    setTimeout(() => {
      setMessages(filtered);
      setIsLoading(false);
    }, 400);
  }, [chatId]);

  const sendMessage = useCallback(
    (text: string, currentUserId: string): string => {
      const newId = `msg-${Date.now()}`;
      const expiresAt = new Date(
        Date.now() + ADMIN_CONFIG.messageExpiry.text,
      ).toISOString();

      const newMsg: Message = {
        id: newId,
        chatId,
        senderId: currentUserId,
        type: MessageType.Text,
        content: text.trim(),
        timestamp: new Date().toISOString(),
        isRead: false,
        expiresAt,
        isViewOnce: false,
        isPlayed: false,
      };

      // FIRESTORE: addDoc(collection(db, 'messages'), { chatId, senderId: currentUserId, type: 'text', content: text.trim(), timestamp: serverTimestamp(), isRead: false, isPlayed: false, isViewOnce: false, expiresAt })

      setMessages((prev) => [...prev, newMsg]);
      return newId;
    },
    [chatId],
  );

  const markConsumed = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, isRead: true, isPlayed: true } : m,
      ),
    );
  }, []);

  const expireMessage = useCallback((messageId: string) => {
    // FIRESTORE: deleteDoc(doc(db, 'messages', messageId))
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, []);

  return { messages, isLoading, sendMessage, markConsumed, expireMessage };
}
