# Hooks

This folder contains all custom React hooks. Each hook encapsulates a single concern — data fetching, auth state, or a UI behavior.

---

## Hook Files

### `useAuth.ts`
Manages Firebase Authentication state.

```typescript
const { user, isLoading, signIn, signOut } = useAuth();
```

- Wraps `onAuthStateChanged` and exposes the current `User | null`
- `signIn(phone, recaptchaVerifier)` — starts phone OTP flow, returns `ConfirmationResult`
- `confirmOtp(confirmationResult, code)` — confirms the OTP code
- `signOut()` — calls `firebase.auth().signOut()`
- Checks the admin allow-list after sign-in; if the phone number is not permitted, signs the user out and throws an error

### `useMessages.ts`
Real-time message subscription for a chat room.

```typescript
const { messages, isLoading, sendMessage } = useMessages(chatId);
```

- Subscribes to the Firestore `chats/{chatId}/messages` collection ordered by `createdAt`
- Filters out expired messages client-side as an extra safety layer
- `sendMessage(content, type)` — writes a new message document with the correct `expiresAt` timestamp based on message type rules in `src/config/admin.ts`
- Handles media upload to Firebase Storage for image/audio/video messages before writing the Firestore doc
- Cleans up the Firestore listener on unmount

### `useTranslate.ts`
Tap-to-translate with multi-API fallback.

```typescript
const { translate, isTranslating, error } = useTranslate();
```

- `translate(text, targetLang)` — tries MyMemory → LibreTranslate → DeepL in order
- Returns the translated string on success or throws after all APIs fail
- Caches results in a `Map` keyed by `${text}:${targetLang}` to avoid redundant API calls
- API keys are read from `src/config/translation.ts` (populated via `.env`)

### `useChats.ts`
Fetches the list of chat rooms for the current user.

```typescript
const { chats, isLoading } = useChats();
```

- Queries Firestore `chats` collection where `memberIds` array contains the current user's UID
- Returns sorted list (most recent activity first)
- Subscribes to real-time updates so new messages and unread counts reflect immediately

### `useExpiry.ts`
Utility hook that returns a live countdown string for a message expiry timestamp.

```typescript
const timeLeft = useExpiry(expiresAt); // e.g. "1:45"
```

- Uses `setInterval` (1s) to recompute the remaining time
- Returns `null` when the message has expired
- Cleans up the interval on unmount

---

## Adding a New Hook

1. Create `src/hooks/useMyHook.ts`
2. Export a named function starting with `use`
3. Document the return type with a TypeScript interface in `src/types/index.ts`
4. Add an entry to this README with a usage example
