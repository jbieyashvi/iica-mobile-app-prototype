# IICA User App — Colour Reference

Audited directly from source (not screenshots).
Sources of truth:
- `tailwind.config.js` → `theme.extend.colors` (semantic tokens)
- `src/index.css` → device-frame chrome + shadows
- Inline `bg-[#…]` / `text-[#…]` utilities and raw hex/`rgba()` in components

Occurrence counts are exact `grep` tallies over `src/**/*.{ts,tsx,css}`.
This is the **User App** only. There is no Admin Panel project in this repository
(see `docs/admin-panel-colors.md`).

---

## 1. Brand

| Semantic name | HEX | RGB | Variable / class | UI usage | Example | Occurrences |
|---|---|---|---|---|---|---|
| Brand primary (magenta) | `#9D2567` | `rgb(157, 37, 103)` | `brand.DEFAULT` → `bg-brand` `text-brand` | Primary buttons, active nav/tab, links, accents | `PrimaryButton.tsx`, `BottomNavigation.tsx` | Token (theme) + **11** raw uses |
| Brand dark (hover/pressed) | `#592049` | `rgb(89, 32, 73)` | `brand.dark` → `hover:bg-brand-dark` `text-brand-dark` | Primary button hover, brand-soft text | `PrimaryButton.tsx`, `StatusBadge.tsx` | Token + **2** raw |
| Brand soft (tint) | `#F8EDF3` | `rgb(248, 237, 243)` | `brand.soft` → `bg-brand-soft` | Icon chips, soft badges, membership cards | `QuickActions.tsx`, `StatusBadge.tsx` | Token |
| Brand-soft body text | `#6D3357` | `rgb(109, 51, 87)` | inline `text-[#6d3357]` | Body copy inside brand-soft cards | `Home.tsx`, `ExploreHome.tsx`, `Profile.tsx` | **6** |

Raw `#9D2567` also used as an `accent` field value in demo data (`demoBuilders.ts`,
`events/mockEvents.ts`) and in the collaboration `MatchWheel` gradient.

---

## 2. Backgrounds and surfaces

| Semantic name | HEX | RGB | Variable / class | UI usage | Example | Occurrences |
|---|---|---|---|---|---|---|
| Page background | `#FAFAF8` | `rgb(250, 250, 248)` | `bg` → `bg-bg`; also `.device-screen`/`.device-outer` | App page background | most screens | Token + **2** raw |
| Surface (cards) | `#FFFFFF` | `rgb(255, 255, 255)` | `surface` → `bg-surface` | Cards, sheets, rows, headers | everywhere | Token (+ `#fff` ×3 in invoice HTML) |
| Outer canvas (mobile body) | `#ECEAE7` | `rgb(236, 234, 231)` | `body` in `index.css` | Behind the device frame | `index.css` | **1** |
| Desktop frame canvas | `#ECEBE7` | `rgb(236, 235, 231)` | `.device-outer` (≥600px) `index.css` | Desktop backdrop | `index.css` | **1** |
| Device frame body | `#1D1D1F` | `rgb(29, 29, 31)` | `.device-frame` | Simulated phone bezel | `index.css` | **1** |
| Dynamic island | `#0D0D0E` | `rgb(13, 13, 14)` | `.device-island` | Decorative island | `index.css` | **1** |

---

## 3. Text

| Semantic name | HEX | RGB / HSL | Variable / class | UI usage | Example | Occurrences |
|---|---|---|---|---|---|---|
| Text primary (ink) | `#191718` | `rgb(25, 23, 24)` · `hsl(330, 4%, 9%)` | `ink` → `text-ink` | Headings, body, labels | everywhere | Token + **4** raw |
| Text secondary (muted) | `#706B6E` | `rgb(112, 107, 110)` | `muted` → `text-muted` | Secondary/hint text, captions | everywhere | Token |
| Warning body text | `#7A5412` | `rgb(122, 84, 18)` | inline `text-[#7a5412]` | Copy inside warning cards | `CollaborateHome.tsx`, `TicketDetail.tsx` | **6** |
| Error body text | `#7A2B30` | `rgb(122, 43, 48)` | inline `text-[#7a2b30]` | Copy inside error cards | `CheckoutPayment.tsx` | **4** |
| Invoice muted grey | `#8A8580` | `rgb(138, 133, 128)` | invoice HTML string | Generated invoice labels | `shop/OrderDetails.tsx` | **5** |

---

## 4. Borders and dividers

| Semantic name | HEX | RGB | Variable / class | UI usage | Example | Occurrences |
|---|---|---|---|---|---|---|
| Border / divider | `#E8E4E6` | `rgb(232, 228, 230)` | `border` → `border-border` `divide-border` | Card borders, dividers, inputs | everywhere | Token + **1** raw |
| Invoice border | `#E7E3DF` | `rgb(231, 227, 223)` | invoice HTML | Generated invoice rules | `shop/OrderDetails.tsx` | **2** |
| Invoice row rule | `#F0ECE8` | `rgb(240, 236, 232)` | invoice HTML | Generated invoice table rows | `shop/OrderDetails.tsx` | **1** |

---

## 5. Buttons and navigation

| Semantic name | HEX | Variable / class | UI usage | Example |
|---|---|---|---|---|
| Primary button bg | `#9D2567` | `bg-brand` | `PrimaryButton` | `PrimaryButton.tsx` |
| Primary button hover | `#592049` | `hover:bg-brand-dark` | `PrimaryButton` | `PrimaryButton.tsx` |
| Primary button text | `#FFFFFF` | `text-white` | `PrimaryButton` | `PrimaryButton.tsx` |
| Secondary button bg | `#FFFFFF` | `bg-surface` | `SecondaryButton` | `SecondaryButton.tsx` |
| Secondary button border | `#E8E4E6` | `border-border` | `SecondaryButton` | `SecondaryButton.tsx` |
| Bottom-nav active | `#9D2567` | `text-brand` | active tab icon/label + top bar | `BottomNavigation.tsx` |
| Bottom-nav inactive | `#706B6E` | `text-muted` | inactive tab | `BottomNavigation.tsx` |
| Nav surface | `#FFFFFF` (95%) | `bg-surface/95` | bottom nav bar | `BottomNavigation.tsx` |

---

## 6. Status colours

| Semantic name | HEX | RGB / HSL | Variable / class | Soft bg | UI usage | Example |
|---|---|---|---|---|---|---|
| Success | `#227A52` | `rgb(34, 122, 82)` · `hsl(150, 56%, 31%)` | `success` → `text-success` | `#EAF3EE` (`bg-[#EAF3EE]`, **24×**) | Confirmed/paid/available, success icons | `StatusBadge.tsx`, `FlowSuccess.tsx` |
| Warning | `#B77818` | `rgb(183, 120, 24)` · `hsl(36, 77%, 41%)` | `warning` → `text-warning` | `#F7F0E4` (`bg-[#F7F0E4]`, **12×**) | Pending/payment states | `StatusBadge.tsx`, `CollaborateHome.tsx` |
| Error | `#B83A42` | `rgb(184, 58, 66)` · `hsl(356, 52%, 47%)` | `error` → `text-error` | `#F7E9EA` (`bg-[#F7E9EA]`, **11×**) | Failures, delete, cancel | `StatusBadge.tsx`, `DeleteAccount.tsx` |
| Success soft bg | `#EAF3EE` | `rgb(234, 243, 238)` | inline | Success badge/pill bg | `StatusBadge.tsx` | 24 |
| Warning soft bg | `#F7F0E4` | `rgb(247, 240, 228)` | inline | Warning badge/card bg | `StatusBadge.tsx` | 12 |
| Error soft bg | `#F7E9EA` | `rgb(247, 233, 234)` | inline | Error badge/card bg | `StatusBadge.tsx` | 11 |
| Neutral badge bg | `black @ 5%` | `rgba(0,0,0,.05)` | `bg-black/[0.05]` | Neutral status pill | `StatusBadge.tsx` |

Note: `StatusBadge` pairs a hardcoded soft bg with the themed status text token,
e.g. `bg-[#EAF3EE] text-success`.

---

## 7. Icons

Icons are Lucide, coloured with the same tokens (no dedicated icon palette):
- Brand icons → `text-brand` (`#9D2567`)
- Muted/decorative → `text-muted` (`#706B6E`)
- Status icons → `text-success` / `text-warning` / `text-error`
- On-image icons → `text-white` on `bg-ink/40`–`/60` overlays

Brand social icons keep official brand hex (see §10 / Hardcoded).

---

## 8. Charts

No charting library. The only "chart" is the analytics bar/spark UI, drawn with tokens:

| Element | Colour | Class | Example |
|---|---|---|---|
| Bar fill (active) | `#9D2567` | `bg-brand`, `bg-brand/80` | `content/creator/ContentAnalytics.tsx` |
| Bar track / progress rail | `#E8E4E6` | `bg-border` | `ContentAnalytics.tsx`, `Upload.tsx` |
| Progress fill | `#9D2567` | `bg-brand` | upload/lesson progress bars |

No hardcoded chart hex.

---

## 9. Overlays and shadows

| Semantic name | Value | Class / source | UI usage | Occurrences |
|---|---|---|---|---|
| Modal/scrim overlay | `ink @ 40%` | `bg-ink/40` (`#191718` @ .4) | Bottom-sheet & dialog scrims | many |
| Image gradient scrim | `black @ 60–75%` | `bg-gradient-to-t from-black/…` | Hero/card text legibility | `FeaturedCarousel.tsx`, cards |
| Hover wash | `black @ ~1.5–5%` | `hover:bg-black/[0.015]` … `[0.05]` | Row/icon hover | lists, headers |
| Subtle shadow | `rgba(25, 23, 24, 0.04)` | `boxShadow.subtle` (`shadow-subtle`) | Cards, toasts, FAB | token |
| Device frame shadow | `rgba(25, 23, 24, 0.16)` | `.device-frame` | Desktop phone shadow | `index.css` |
| Home indicator | `rgba(25, 23, 24, 0.28)` | `.device-home` | Decorative | `index.css` |
| Device caption | `rgba(25, 23, 24, 0.35)` | `.device-caption` | "IICA · Mobile Prototype" label | `index.css` |
| White scrim (media) | `rgba(255, 255, 255, .9)` | inline | Play button bg over media | media viewer | 2 |

---

## 10. Gradients

| Name | Definition | Class / source | Usage |
|---|---|---|---|
| Card/hero scrim | `linear-gradient(to top, black/75 → black/15 → transparent)` | `bg-gradient-to-t from-black/75 via-black/15 to-transparent` | `FeaturedCarousel.tsx`, `cards.tsx`, `catalogueCards.tsx` |
| Membership/hero image scrim | `from-black/60 to-transparent` | Tailwind gradient | `CollaborateHome.tsx` non-active hero |
| MatchWheel brand sweep | brand `#9D2567` based conic/gradient | `components/collab/MatchWheel.tsx` | Collaboration matching animation |

---

## Hardcoded colours (raw hex, not tokenised)

Status softs and body texts (should become tokens):
- `#EAF3EE` ×24, `#F7F0E4` ×12, `#F7E9EA` ×11 (status soft backgrounds)
- `#7A5412` ×6, `#6D3357` ×6, `#7A2B30` ×4 (on-tint body text)
- `#191718` ×4, `#FAFAF8` ×2, `#E8E4E6` ×1 (duplicates of existing tokens — see below)

Brand social colours (intentional, keep as-is):
- WhatsApp `#25D366` ×3 · Instagram `#E4405F` ×3 · Facebook `#1877F2` ×3 · LinkedIn `#0A66C2` ×3
- YouTube `#FF0000` ×2 · Spotify `#1DB954` ×1
- Google logo: `#4285F4`, `#EA4335`, `#FBBC05`, `#34A853` (×1 each) — `SocialButtons.tsx`
- Files: `explore/ShareSheet.tsx`, `artist/ArtistShare.tsx`, `portfolio/PortfolioShare.tsx`, `form/SocialButtons.tsx`

Invoice-only (generated HTML string in `shop/OrderDetails.tsx`):
- `#191718`, `#9D2567`, `#8A8580` ×5, `#E7E3DF` ×2, `#F0ECE8`, `#FFFFFF`

Device chrome (`index.css`): `#ECEAE7`, `#ECEBE7`, `#FAFAF8`, `#1D1D1F`, `#0D0D0E`, `rgba(25,23,24,*)`.

Other one-offs: `#0F1512` ×1, `#EDEBE7` ×1.

---

## Duplicate or near-duplicate colours

- **`#FAFAF8`** appears both as the `bg` token and hardcoded ×2 in `index.css` — same value, should reference the token.
- **`#191718`** hardcoded ×4 duplicates the `ink` token.
- **`#E8E4E6`** hardcoded ×1 duplicates the `border` token.
- **Near-duplicate off-whites**: `#FAFAF8` (bg), `#ECEAE7` (mobile body), `#ECEBE7` (desktop outer), `#EDEBE7` (one-off) — four very close warm greys within ~4 ΔL; `#ECEBE7`/`#EDEBE7`/`#ECEAE7` are effectively interchangeable.
- **Invoice greys** `#8A8580`, `#E7E3DF`, `#F0ECE8` are near-duplicates of `muted`/`border` but live in a standalone HTML string, so they don't inherit tokens.

---

## Inconsistent usage

- Status **text** is tokenised (`text-success/warning/error`) but the matching **soft backgrounds** are always raw hex (`bg-[#EAF3EE]` etc.). Split system — bg should be tokenised too.
- On-tint body text uses ad-hoc darkened hex (`#6d3357`, `#7a5412`, `#7a2b30`) instead of a token; values are consistent but literal-duplicated 4–6× each.
- `StatusBadge` neutral tone uses `bg-black/[0.05] text-muted` while other softs use named hex — mixed strategies for the same concept.
- Device/frame chrome hardcodes near-identical off-whites (`#ECEAE7` vs `#ECEBE7`).

---

## Contrast concerns (WCAG, against typical bg)

- `muted #706B6E` on `surface #FFFFFF` ≈ **4.7:1** — passes AA for normal text, but tight; avoid for <12px.
- `muted #706B6E` on `bg #FAFAF8` ≈ **4.5:1** — right at the AA threshold.
- `warning #B77818` on white ≈ **3.5:1** — **fails AA** for normal text; acceptable only for ≥18px/bold or as an accent, not for body copy.
- Soft-tint body texts (`#7a5412` on `#F7F0E4`, `#6d3357` on `#F8EDF3`, `#7a2b30` on `#F7E9EA`) are all ≥ **5:1** — good.
- White text on `brand #9D2567` ≈ **5.9:1** — passes AA.
- `success #227A52` on white ≈ **4.9:1**, `error #B83A42` on white ≈ **4.4:1** — borderline AA; keep for labels/icons, not tiny text.

---

## Suggested consolidated token list

Promote the following to CSS variables (already provided in
`src/styles/user-app-colors.css`):

```
--color-primary            #9D2567
--color-primary-hover      #592049
--color-primary-soft       #F8EDF3
--color-on-primary         #FFFFFF
--color-page-background     #FAFAF8
--color-surface            #FFFFFF
--color-canvas             #ECEAE7   /* unify #ECEBE7/#EDEBE7 here */
--color-text-primary       #191718
--color-text-secondary     #706B6E
--color-border             #E8E4E6
--color-success            #227A52
--color-success-soft       #EAF3EE
--color-warning            #B77818
--color-warning-soft       #F7F0E4
--color-warning-text       #7A5412
--color-error              #B83A42
--color-error-soft         #F7E9EA
--color-error-text         #7A2B30
--color-brand-text-on-soft #6D3357
--color-overlay            rgba(25, 23, 24, 0.40)
--color-shadow-subtle      rgba(25, 23, 24, 0.04)
```

Keep brand-social hex out of the design tokens (they are third-party brand marks).
