# MyApp — Private Chat App

A private, privacy-focused chat application for your group. Built with React + TypeScript + Tailwind CSS.

---

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm installed
- Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)

### 1. Install dependencies
```bash
pnpm install
```

### 2. Configure Firebase
```bash
# Copy the example env file
cp .env.example .env
```
Then fill in your Firebase credentials from:
**Firebase Console → Project Settings → Your apps → SDK setup and configuration**

Next, enable phone authentication:
**Firebase Console → Authentication → Sign-in method → Phone → Enable**

Finally, add your users' phone numbers:
**Firebase Console → Authentication → Users → Add user**

### 3. Add allowed users
Open `src/config/admin.ts` and add phone numbers in E.164 format (e.g., `+1234567890`).

### 4. Run locally
```bash
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173)

### 5. Build for production
```bash
pnpm build
```

---

## Building the Android APK

### Prerequisites
- [Android Studio](https://developer.android.com/studio) installed
- Java 17+
- Capacitor CLI: `npm install -g @capacitor/cli`

### Steps

```bash
# 1. Build the web app
pnpm build

# 2. Add Android platform (first time only)
npx cap add android

# 3. Sync web assets to native project
npx cap sync

# 4. Open in Android Studio
npx cap open android
```

In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

> **Tip:** After every `pnpm build`, always run `npx cap sync` to push updated web assets to the Android project.

---

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Chat/         # Chat bubbles, message input, media preview
│   └── ui/           # shadcn/ui base components
├── config/           # Firebase, admin settings, translation API config
├── hooks/            # Custom React hooks (auth, messages, translate)
├── i18n/             # i18next setup and language registration
├── locales/          # Translation JSON files (en, es, pt)
├── pages/            # Route-level page components
├── services/         # Translation service (multi-API fallback)
└── types/            # Shared TypeScript types
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Firebase credentials and API keys — **NEVER commit this file** |
| `src/config/firebase.ts` | Firebase SDK initialization using env vars |
| `src/config/admin.ts` | Allowed phone numbers and admin settings |
| `src/config/translation.ts` | Translation API keys (MyMemory, LibreTranslate, DeepL) |
| `capacitor.config.ts` | Capacitor mobile app settings |

---

## Adding a New Language

1. Create `src/locales/{langCode}.json` (copy `en.json` as a template)
2. Translate all values in the new file
3. Add the language entry to the `SUPPORTED_LANGUAGES` array in `src/i18n/index.ts`
4. Add the language option to the Settings page language selector

---

## Message Expiry Rules

| Message Type | Expires |
|-------------|----------|
| Text | 2 minutes after sending |
| Image | Immediately after viewed (view-once) |
| Audio | Immediately after played |
| Video | Immediately after watched |

All expiry is enforced by Firestore TTL rules and the Firestore cleanup hook.

---

## Privacy

- All messages are stored in Firestore and **deleted automatically** after expiry
- No persistent message history is retained
- Admin controls user access — no self-registration
- Phone numbers are verified via Firebase Phone Auth OTP

---

## Environment Variables Reference

See `.env.example` for all required variables. Never commit `.env` to version control.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_MYMEMORY_API_KEY=
VITE_LIBRETRANSLATE_API_KEY=
VITE_DEEPL_API_KEY=
```

---

## Support

For Firebase issues, see the [Firebase documentation](https://firebase.google.com/docs).
For Capacitor issues, see the [Capacitor documentation](https://capacitorjs.com/docs).
