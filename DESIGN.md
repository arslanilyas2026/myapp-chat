# Design Brief: WhatsApp-Clone Chat App

## Purpose
Mobile-first WhatsApp-clone chat application. Pixel-perfect recreation of WhatsApp's UI/UX with authentic green theme and warm beige chat background.

## Tone & Differentiation
Utilitarian-friendly, intentionally minimal. No decorative flourish — clarity and functionality are paramount. Familiarity through WhatsApp's proven, globally-recognized patterns. Warm beige humanizes the interface.

## Color Palette (OKLCH)
| Token | OKLCH | Hex (reference) | Role |
|-------|-------|-----------------|------|
| Primary (action green) | 0.71 0.19 142 | #25D366 | Send button, active states, highlights |
| Secondary (teal) | 0.50 0.12 180 | #128C7E | Read receipts, secondary accents |
| Accent (dark green header) | 0.32 0.10 171 | #075E54 | Header/status bar, navigation |
| Background (warm beige) | 0.95 0.03 32 | #ECE5DD | Chat area, conversation list |
| Card (white) | 1.0 0 0 | #FFFFFF | Received message bubbles |
| Sent bubble (light lime) | 0.92 0.06 114 | #DCF8C6 | Sent message bubbles |
| Muted (subtle) | 0.88 0.02 32 | N/A | Timestamps, secondary text |
| Destructive | 0.55 0.22 25 | N/A | Error states, delete actions |

## Typography
| Family | Use | Reason |
|--------|-----|--------|
| Satoshi | Display, UI labels, buttons | Confident, modern sans-serif |
| Nunito | Body, messages, descriptions | Friendly, warm, readable |
| Monospace | Code/technical references | System default |

## Structural Zones
| Zone | Background | Treatment |
|------|------------|----------|
| Status bar / header | Accent (#075E54) | White text, back arrow, contact name, options menu; subtle shadow below |
| Conversation list | Background (#ECE5DD) | Contact rows: circular avatar + name (Satoshi bold) + last message (truncated) + timestamp; dividers between |
| Chat view | Background (#ECE5DD) | Sent bubbles (light lime, right-aligned) + received bubbles (white, left-aligned); timestamps below bubbles |
| Input bar | Card white | Text field with emoji icon, attachment icon; green send button on right; border-top |

## Component Patterns
- **Message bubbles:** Sent (light lime #DCF8C6, 4px border-radius, right-aligned, padding 12px). Received (white, 4px border-radius, left-aligned, padding 12px). Timestamps in muted Nunito, 12px below.
- **Conversation rows:** Avatar (circular, 56px), name (bold Satoshi 16px), last message (Nunito 14px, truncated, muted), timestamp (right-aligned, muted 12px).
- **Header:** Back arrow (left), contact/group name (center, bold Satoshi 18px), options menu (right, three dots).
- **Input bar:** Text input (Nunito 14px, flex-grow), emoji button, attachment button, send button (primary green, icon only).

## Elevation & Depth
Flat design with minimal shadows. Header only casts subtle shadow to separate from content. No shadows on bubbles, cards, or message rows.

## Spacing & Rhythm
Mobile-first, compact density. 8px baseline spacing. Message bubbles: 12px padding. List rows: 16px top/bottom. Gap between messages: 2px.

## Motion
Snappy, minimal. Send button highlights and scales slightly on tap. Messages fade in on arrival. No bouncy animations or transitions >200ms.

## Constraints
Pixel-perfect WhatsApp fidelity required. Exact colors, exact bubble shapes, exact layout. No generic AI aesthetic. Mobile portrait first; responsive tablet/desktop secondary.

## Signature Detail
Warm beige chat background (#ECE5DD) instead of cold grey — matches WhatsApp's authentic humanizing choice and creates visual warmth without losing clarity.
