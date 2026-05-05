# Pages

This folder contains one file per route/screen in the application. All pages are registered in `src/App.tsx` using React Router.

---

## Page Files

### `LoginPage.tsx`
Phone number entry and OTP verification screen.
- Renders a centered card with country code selector and phone number input
- On submit, calls `firebase.auth().signInWithPhoneNumber()` with a reCAPTCHA verifier
- On OTP entry, calls `confirmationResult.confirm(code)` to verify and sign in
- Redirects unauthenticated users here from all protected routes
- If the user's phone number is not in the admin allow-list, shows an "Access denied" error
- **i18n keys:** `login.*`

### `ChatsListPage.tsx`
Main screen showing all active conversations (WhatsApp "Chats" tab equivalent).
- Lists all chat rooms accessible to the current user
- Shows last message preview, timestamp, and unread count badge
- Tapping a row navigates to `ChatRoomPage` for that chat
- Floating action button opens `NewChatModal` (admin only)
- **i18n keys:** `chats.*`

### `ChatRoomPage.tsx`
Full chat screen for a single conversation.
- Fetches messages for the given `chatId` via `useMessages` hook (real-time Firestore listener)
- Renders a scrollable list of `ChatBubble` components
- Sticky header shows contact name/avatar and a back button
- Bottom `MessageInput` handles text, image, audio, and video sending
- Auto-scrolls to the latest message on new arrivals
- **i18n keys:** `chat.*`

### `SettingsPage.tsx`
User preferences and app configuration.
- Language selector — changes the active i18next language and persists to localStorage
- Theme toggle (light / dark) if supported
- Display name editor (stored in Firestore user profile)
- Sign out button
- App version and build info at the bottom
- **i18n keys:** `settings.*`

### `NotFoundPage.tsx`
Catch-all 404 page.
- Shown for any route not matched by the router
- Contains a link back to the home/chats page
- **i18n keys:** `errors.notFound`

---

## Route Structure

```
/              → ChatsListPage   (protected)
/chat/:chatId  → ChatRoomPage    (protected)
/settings      → SettingsPage    (protected)
/login         → LoginPage       (public)
*              → NotFoundPage
```

Protected routes redirect to `/login` when `auth.currentUser` is null.

---

## Adding a New Page

1. Create `src/pages/MyNewPage.tsx`
2. Add a `<Route path="/my-path" element={<MyNewPage />} />` in `src/App.tsx`
3. If protected, wrap with the `<ProtectedRoute>` component
4. Add i18n keys under a new namespace in all locale files (`src/locales/*.json`)
