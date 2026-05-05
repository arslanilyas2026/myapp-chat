# Types

This folder contains all shared TypeScript interfaces, enums, and type aliases for MyApp.

## File: `index.ts`

All types are exported from a single file for easy imports:
```ts
import type { User, Message, Chat, MessageType } from '@/types';
```

## Type Overview

| Type               | Description |
|--------------------|-------------|
| `MessageType`      | Enum: `text \| image \| audio \| video` |
| `AppLanguage`      | Union: `'en' \| 'es' \| 'pt'` |
| `User`             | A registered user (uid, phone, displayName, avatar, online status) |
| `Message`          | A chat message with expiry and view-once support |
| `Chat`             | A conversation between participants |
| `TranslationResult`| Result from the tap-to-translate feature |
| `AuthState`        | Current auth loading/user/error state |

## Extending Types

- Add new fields to existing interfaces as your Firebase data model evolves.
- When adding a new message type (e.g. `document`), add it to the `MessageType` enum and update Firestore rules + expiry config in `config/admin.ts`.
- `expiresAt: null` means the message never auto-deletes (currently unused but kept for flexibility).
