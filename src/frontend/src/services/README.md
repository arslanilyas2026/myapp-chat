# Services

This folder contains non-React service modules — pure functions or classes that handle external API calls, formatting, and other stateless logic.

---

## Service Files

### `translationService.ts`
Multi-API translation with automatic fallback.

#### Supported Providers (tried in order)

| Priority | Provider | Notes |
|----------|----------|-------|
| 1 | **MyMemory** | Free tier, no key required for low volume; key extends limit |
| 2 | **LibreTranslate** | Self-hostable; public instance used if no custom URL set |
| 3 | **DeepL** | Highest quality; requires paid API key |

#### API

```typescript
import { translateText } from '@/services/translationService';

const result = await translateText({
  text: 'Hello, world!',
  targetLang: 'es',           // ISO 639-1 code
  sourceLang: 'auto',         // optional, defaults to 'auto'
});
// result.translatedText === 'Hola Mundo'
// result.provider === 'mymemory'
```

#### Configuration

All API keys are loaded from `src/config/translation.ts` which reads from `.env`.
Set the following in `.env`:

```
VITE_MYMEMORY_API_KEY=     # ADMIN: Add your MyMemory API key here (optional)
VITE_LIBRETRANSLATE_API_KEY=  # ADMIN: Add your LibreTranslate API key here
VITE_DEEPL_API_KEY=        # ADMIN: Add your DeepL API key here
```

#### Fallback Logic

```
translateText(text, targetLang)
  └─ try MyMemory
       ├─ success → return result
       └─ fail → try LibreTranslate
                   ├─ success → return result
                   └─ fail → try DeepL
                               ├─ success → return result
                               └─ fail → throw TranslationError
```

#### Language Code Mapping

MyMemory uses `en|es` format; LibreTranslate and DeepL use standard ISO 639-1 codes.
The service handles code normalization internally — callers always pass standard ISO codes.

---

## Adding a New Translation Provider

1. Add the provider's API key placeholder to `.env.example` and `src/config/translation.ts`
2. Implement a `translateWith{Provider}(text, sourceLang, targetLang)` function in `translationService.ts`
3. Add it to the fallback chain in `translateText()` at the desired priority
4. Document it in the table above

---

## Adding Other Services

If you need to add new service modules (e.g., analytics, crash reporting):
1. Create `src/services/myService.ts`
2. Keep it a pure module — no React hooks, no JSX
3. Add any required env vars to `.env.example`
4. Document it in this README
