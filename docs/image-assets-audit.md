# IICA User App — Image Asset Audit (read-only)

Audited directly from source across `src/`, `public/`, components, pages,
mock-data, CSS, Tailwind config and TS/JSON data files. Nothing was modified,
downloaded, or moved.

## TL;DR

- **No `public/` folder exists.** No `.png/.jpg/.jpeg/.webp/.gif/.svg` files are
  committed anywhere in the repo. No `import x from '*.png'`. No base64/data URLs.
- **Every raster image is a remote URL** — overwhelmingly **Unsplash**
  (`images.unsplash.com`): **150 references**, **~50 distinct photos** (each
  reused ~3×). Loaded at runtime via `<img src={…}>`.
- **All vector graphics are code-drawn** (Lucide icon components + a handful of
  inline `<svg>`), so they need no asset files.
- One **dynamic external image**: YouTube thumbnails built in `lib/youtube.ts`.
- That's why the UI shows images but there's no assets folder: the images live on
  Unsplash's CDN, referenced by URL inside mock-data files.

---

## Inventory by source type

| Source type | Count | Available in repo? | Needs asset file? |
|---|---|---|---|
| External URL — Unsplash (`images.unsplash.com`) | 150 refs / ~50 photos | ❌ No | ✅ If offline/self-hosted build wanted |
| External URL — YouTube thumbnail (`img.youtube.com/vi/…`) | 1 generator (`lib/youtube.ts`) | ❌ No (derived from video id) | ⚠️ Optional |
| Inline `<svg>` (code-drawn) | 5 blocks | ✅ Yes (in code) | ❌ No |
| Lucide icon components | app-wide | ✅ Yes (npm) | ❌ No |
| Base64 / `data:` image | 0 | — | — |
| Blob / `createObjectURL` **image** | 0 (only 1 HTML-invoice blob) | — | — |
| CSS `background-image` / `bg-[url(…)]` | 0 | — | — |
| Local imported image files | 0 | — | — |

Non-image external URLs also present (not assets): `iica.app` share links,
`youtube.com`/`youtu.be` video embeds, `open.spotify.com`, `instagram/facebook/
linkedin.com` profile links, `zoom.us`, `yashvi.design`, `example.com` demo emails.

---

## Where the images live (by screen / component)

All raster images come from mock-data modules, consumed by many screens.

| Purpose | Defined in (source of truth) | Rendered by (examples) | Source | In repo? | Recommended local path |
|---|---|---|---|---|---|
| Artist / creator photos & avatars | `data/publicArtists.ts` (33), `data/artists.ts` (6) | Explore catalogue, `PublicArtistPortfolio`, `ArtistCard`, `cards.tsx`, `catalogueCards.tsx` | Unsplash | ❌ | `assets/images/artists/*.jpg` |
| Explore content thumbnails, category tiles, collections, shop preview | `data/exploreData.ts` (23) | `ExploreHome`, `ExploreContent`, `ContentCard`, category cards | Unsplash | ❌ | `assets/images/content/*.jpg`, `assets/images/categories/*.jpg` |
| Portfolio gallery / media / chapters | `portfolio/mockPortfolio.ts` (17) | `PortfolioPreview`, `PublicArtistPortfolio` gallery | Unsplash | ❌ | `assets/images/portfolio/*.jpg` |
| Collaboration candidate photos | `collab/mockCollab.ts` (12) | `SwipeCard`, `MatchDetails`, `Recommendations` | Unsplash | ❌ | `assets/images/collab/*.jpg` |
| Event covers | `events/mockEvents.ts` (11), `data/events.ts` (4) | `EventsDiscovery`, `EventDetail`, `EventCard`, `BookingConfirmation` | Unsplash | ❌ | `assets/images/events/*.jpg` |
| Shop product covers | `shop/mockShop.ts` (10) | `ShopHome`, `ProductDetail`, `Cart`, `Library`, `OrderDetails` | Unsplash | ❌ | `assets/images/products/*.jpg` |
| Archive/watch video thumbnails | `data/archive.ts` (8) | `ArchiveVideoCard`, `ArchiveVideoDetail` | Unsplash | ❌ | `assets/images/archive/*.jpg` |
| Demo user photo/cover + content demo | `demo/demoData.ts` (6), `demo/demoBuilders.ts` (5) | Profile, portfolio/event/product demo loaders | Unsplash | ❌ | `assets/images/demo/*.jpg` |
| Welcome collage (4 images) | `pages/auth/Welcome.tsx` (4, inline array) | Welcome screen | Unsplash | ❌ | `assets/images/welcome/collage-1..4.jpg` |
| "What's New" cards, featured carousel | `data/whatsNew.ts` (4), `data/featured.ts` (3) | Home hero + What's New | Unsplash | ❌ | `assets/images/home/*.jpg` |
| Header/profile avatar (hardcoded) | `Profile.tsx`, `EditProfile.tsx`, `AppHeader.tsx`, `ProfileAvatarButton.tsx` | Profile header + avatar button | Unsplash (same photo id `1489424731084-a5d8b219a5bb`) | ❌ | `assets/images/demo/user-avatar.jpg` |
| Non-active Collaborate hero | `pages/collaborate/CollaborateHome.tsx` (1, inline) | Collaborate empty state | Unsplash | ❌ | `assets/images/collab/hero.jpg` |
| YouTube video thumbnail | `lib/youtube.ts` → `img.youtube.com/vi/{id}/hqdefault.jpg` | portfolio/media embeds | Derived external | ❌ | n/a (fetched from video id) |
| Avatar fallback (no photo) | `components/Avatar.tsx` | anywhere `src` is absent | **Initials on tinted bg** (no image) | ✅ code | none |
| Brand social logos (Google/Spotify) | `components/form/SocialButtons.tsx` | login / social buttons | **Inline `<svg>`** | ✅ code | none |
| Matching animation | `components/collab/MatchWheel.tsx` | Discover → matching | **Inline `<svg>`** (drawn) | ✅ code | none |
| QR code | `components/portfolio/QrCode.tsx` | portfolio share | **Inline `<svg>`** (generated) | ✅ code | none |

---

## Inline SVG (no asset needed)

| File | What it draws |
|---|---|
| `components/collab/MatchWheel.tsx` | Two `<svg>` rings for the matching animation |
| `components/form/SocialButtons.tsx` | Google + Spotify brand logos (`<svg>`) |
| `components/portfolio/QrCode.tsx` | Generated QR grid (`<svg role="img">`) |

All other icons are **Lucide** React components (bundled via npm) — vector, no files.

---

## Specific findings

### Broken image URLs
- None *proven* broken. All raster URLs are Unsplash CDN hotlinks with sizing
  params (`?w=…&q=80&auto=format&fit=crop`). Not verified live (audit is
  read-only / no network fetch). Risk: hotlinking depends on Unsplash keeping the
  photo id public and on rate limits.

### Duplicate images
- **~150 references → ~50 distinct photos**, so most photos are reused ~3×.
  Examples of reuse across modules:
  - `photo-1489424731084-a5d8b219a5bb` — the profile avatar, referenced in
    `Profile.tsx`, `EditProfile.tsx`, `AppHeader.tsx`, `ProfileAvatarButton.tsx`.
  - Welcome collage photos (`1547153760-…`, `1511671782779-…`, `1514320291840-…`)
    reappear in featured/collab/category data.
  - Portfolio `demoWork` photos are reused across timeline, awards, gallery,
    collaborations in `mockPortfolio.ts` / `demoBuilders.ts`.

### Temporary / placeholder images
- Every Unsplash photo is effectively a **placeholder** — stock imagery standing
  in for real creator/product/event media. No dedicated placeholder service
  (no `placehold.co`, `picsum`, `via.placeholder`, `dummyimage`).
- `Avatar.tsx` initials block is the only true fallback placeholder.

### External images that may expire / change
- All 150 Unsplash URLs depend on Unsplash. Direct `images.unsplash.com/photo-…`
  links are relatively stable but **can be removed by the photographer**, are
  **rate-limited for hotlinking**, and require network access — so they will
  **break offline** and in air-gapped/CI/screenshot environments.
- YouTube thumbnails (`img.youtube.com`) break if the video id is removed/private.

### Uncertain licensing
- Unsplash images fall under the **Unsplash License** (free commercial/non-commercial,
  no permission needed, no attribution required) — generally safe, **but** these
  are demo stand-ins; for production, licensing of the *actual* creator/product
  imagery must be confirmed with rights holders. Treat all current photos as
  **demo-only, replace before launch**.

### Missing alt text
- **88 `<img>` tags; 0 are missing the `alt` attribute.** **75** use `alt=""`
  (intentional decorative). Content-bearing images (product/event/artist covers)
  mostly use `alt=""` too — technically valid but **not descriptive**; for
  accessibility, meaningful images should get real alt text (e.g. product title,
  artist name). `Avatar` derives an accessible name from `name`.

### Images loaded dynamically
- `lib/youtube.ts` builds thumbnail URLs from a video id at runtime.
- Unsplash URLs are interpolated from mock-data fields into `src={…}` at render.
- No `createObjectURL`/blob **images** (the one blob in `OrderDetails.tsx` is the
  generated HTML **invoice**, not an image).

---

## Answers

**1. Where are the current prototype images coming from?**
Remote URLs — almost entirely **Unsplash** (`images.unsplash.com`, 150 refs / ~50
photos), plus dynamically-built **YouTube thumbnails**. They're hardcoded as URL
strings inside mock-data modules (`data/`, `collab/`, `events/`, `shop/`,
`portfolio/`, `demo/`) and a few components (`Welcome.tsx`, `Profile.tsx`).

**2. Why is there no images folder?**
Because no images are stored locally — the prototype references stock photos by
URL and renders all icons/graphics as code (Lucide + inline `<svg>`). There is no
`public/` directory and no bundled/imported image files, so there's nothing to
put in an assets folder.

**3. Which images are already local?**
Only vector/code graphics: **Lucide icons**, and inline `<svg>` in `MatchWheel`,
`SocialButtons` (Google/Spotify logos) and `QrCode`, plus the `Avatar` initials
fallback. Zero raster files are local.

**4. Which images are external?**
All raster imagery: **150 Unsplash URLs (~50 photos)** and the **YouTube
thumbnail** generator. Also non-image external links (iica.app, YouTube/Spotify
embeds, social profiles, example.com) — not assets.

**5. Which assets must be downloaded or provided separately?**
To have a self-contained, offline-safe app you must obtain/host **the ~50 distinct
Unsplash photos** (dedupe first — 150 refs collapse to ~50 files), organised under
a new `assets/images/` (or `public/images/`) tree by category (artists, content,
events, products, portfolio, collab, archive, demo, welcome, home). Optionally
cache the YouTube thumbnails. Nothing else (icons/SVG) needs downloading. For
production, **replace all demo Unsplash stand-ins with licensed real media**.

---

## Suggested next steps (not done here)

1. Extract the ~50 distinct Unsplash URLs, download once, dedupe by photo id.
2. Create `assets/images/<category>/…` and a small `image path` map so mock-data
   references local files instead of URLs.
3. Add descriptive `alt` text to content-bearing images.
4. Keep icons/SVG as code (no change needed).
