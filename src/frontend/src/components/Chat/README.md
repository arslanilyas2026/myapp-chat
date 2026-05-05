# Chat Components

This folder contains all components related to the chat interface. These are composed inside the `ChatRoom` page.

---

## Components

### `ChatBubble.tsx`
Renders a single chat message bubble.
- **Props:** `message: Message`, `isOwn: boolean`
- Own messages appear on the right (green bubble); received messages appear on the left (white/dark bubble)
- Displays sender name, timestamp, read receipt ticks, and expiry countdown
- Supports text, image (blur until tap), audio (inline player), and video (inline player) message types
- Shows a "Tap to translate" button that triggers the translation service

### `MessageInput.tsx`
The bottom input bar for composing and sending messages.
- **Props:** `onSend: (message: NewMessage) => void`
- Supports text entry, emoji picker, and media attachment (image, audio, video)
- Enforces message type rules (text, image, audio, video) based on the attached file
- Send button is disabled while a message is being uploaded

### `MediaPreview.tsx`
Full-screen overlay for previewing an image/video before sending.
- **Props:** `file: File`, `onConfirm: () => void`, `onCancel: () => void`
- Shows a thumbnail or video frame with confirm/cancel controls

### `AudioPlayer.tsx`
Inline audio waveform player used inside `ChatBubble` for audio messages.
- **Props:** `url: string`, `onPlayed: () => void`
- Calls `onPlayed` when playback reaches the end (triggers auto-delete)

### `ExpiryBadge.tsx`
Small countdown badge displayed on a message bubble showing time remaining before deletion.
- **Props:** `expiresAt: Date`
- Updates every second; hidden once message is expired

### `TranslationOverlay.tsx`
Overlay card shown when the user taps "Translate" on a message.
- **Props:** `original: string`, `translated: string | null`, `isLoading: boolean`
- Shows a spinner while the translation API responds
- Displays the translated text in a styled card with the detected source language

---

## Types

All message types are defined in `src/types/index.ts`.

```typescript
type MessageType = 'text' | 'image' | 'audio' | 'video';

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  type: MessageType;
  content: string;       // text content or storage URL
  createdAt: Date;
  expiresAt: Date;
  readBy: string[];      // UIDs of users who have read the message
}
```

---

## Adding New Message Types

1. Add the new type to the `MessageType` union in `src/types/index.ts`
2. Handle the new type in `ChatBubble.tsx` (render branch)
3. Handle sending the new type in `MessageInput.tsx`
4. Add expiry rules in `src/config/admin.ts`
