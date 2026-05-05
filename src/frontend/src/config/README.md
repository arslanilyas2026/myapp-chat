# Config

This folder contains all app-level configuration files. Each file is clearly annotated with `// ADMIN:` comments wherever you need to fill in credentials or settings.

---

## Files

### `firebase.ts`
Firebase SDK initialization. Reads credentials from environment variables (`.env`).

**What to do:**
1. Create a Firebase project at https://console.firebase.google.com
2. Add a Web app to your project
3. Copy the `firebaseConfig` values into `src/frontend/.env`
4. Enable **Phone Authentication** under Authentication → Sign-in method
5. Create a **Firestore Database** (start in test mode, then lock rules)

### `admin.ts`
App-wide admin settings: allowed users, message expiry rules, app name.

**What to do:**
- Add E.164 phone numbers (e.g. `+15550001234`) to `allowedPhoneNumbers`
- Adjust `messageExpiry` durations if needed
- Change `appName` to your desired branding

### `translation.ts`
API keys for the tap-to-translate fallback chain (MyMemory → LibreTranslate → DeepL).

**What to do:**
- Add API keys to `src/frontend/.env` for each service you want to use
- MyMemory works with no key for low-volume usage
- LibreTranslate can be self-hosted for free
- DeepL requires a paid plan for production use

---

## Environment Variables

All secrets live in `src/frontend/.env` (never committed to git). Copy `.env.example` to `.env` and fill in your values.

```sh
cp .env.example .env
# then edit .env with your credentials
```
