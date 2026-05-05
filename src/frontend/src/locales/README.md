# Locales

This folder contains all UI translation strings for MyApp. Every user-visible string is stored here — nothing is hardcoded in component files.

## Current Languages

| File     | Language               |
|----------|------------------------|
| `en.json` | English (default)     |
| `es.json` | Spanish (Español)     |
| `pt.json` | Portuguese (Português) |

## Adding a New Language

1. Copy `en.json` to a new file named with the [BCP 47 language tag](https://www.ietf.org/rfc/bcp/bcp47.txt), e.g. `fr.json` for French.
2. Translate **every value** in the new file. Do not leave any English text.
3. Register the new language in `src/i18n/index.ts`:
   ```ts
   // Add to resources:
   fr: { translation: fr },
   // Add to supportedLngs:
   supportedLngs: ['en', 'es', 'pt', 'fr'],
   ```
4. Import the new JSON file in `src/i18n/index.ts`:
   ```ts
   import fr from '../locales/fr.json';
   ```
5. Add the display name to **all existing locale files** under `settings.languages`:
   ```json
   "fr": "French (Français)"
   ```
6. Add the new language code to the `AppLanguage` type in `src/types/index.ts`.

## Key Structure

```
translation
├── auth.*          — Login / OTP screens
├── conversations.* — Chat list screen
├── chat.*          — Individual chat screen
├── settings.*      — Settings screen
└── common.*        — Shared strings (buttons, errors, etc.)
```

## Interpolation

Some strings contain placeholders like `{{time}}` or `{{phone}}`. These are replaced at runtime by the component. Do not remove or rename them when translating.
