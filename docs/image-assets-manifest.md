# IICA Prototype — Image Assets Manifest (developer handoff)

Prepared from `docs/image-assets-audit.md`. Each distinct externally-referenced
Unsplash image was downloaded **once** (deduplicated by photo id) into
`src/assets/images/`, organised by category. Filenames are semantic.

**Not touched:** application code still points at the original remote URLs — these
local files are a handoff package only. Lucide icons, inline SVGs and the Avatar
initials fallback are code-drawn and intentionally excluded. YouTube thumbnails
are dynamic and are **listed, not downloaded** (see bottom).

- Distinct Unsplash photos: **50** (from ~150 references — deduped)
- Downloaded: **50** files · ~5.0 MB
- Folders: `avatars/` (17), `banners/` (15), `events/` (6), `products/` (7), `portfolios/` (5)
- Resolution: avatars `w=400`, banners `w=1200`, events/products/portfolios `w=1000` (preserved from/above UI usage)

> ⚠️ **Licensing:** every image is an **Unsplash** stock stand-in (Unsplash License —
> free, no attribution required). These are **demo placeholders**. Every file below
> must be **replaced with licensed, real creator/product/event media before
> production.** Treat the entire set as "needs licensed production replacement".

---

## avatars/  — creator & user portraits
Source type: External URL (Unsplash). Available now: ✅ (downloaded). Needs real asset for production: ✅

| Local file | Original photo id | Source URL |
|---|---|---|
| `creator-ananya-rao.jpg` | `photo-1531123897727-8f129e1688ce` | https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80&auto=format&fit=crop |
| `creator-yashvi.jpg` | `photo-1494790108377-be9c29b29330` | https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop |
| `user-demo-avatar.jpg` | `photo-1489424731084-a5d8b219a5bb` | https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80&auto=format&fit=crop |
| `creator-kavya-sharma.jpg` | `photo-1534528741775-53994a69daeb` | https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80&auto=format&fit=crop |
| `creator-zoya-khan.jpg` | `photo-1524504388940-b1c1722653e1` | https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80&auto=format&fit=crop |
| `creator-kabir-menon.jpg` | `photo-1507003211169-0a1dd7228f2d` | https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop |
| `creator-rohan-sen.jpg` | `photo-1500648767791-00dcc994a43e` | https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop |
| `creator-arjun-mehta.jpg` | `photo-1492562080023-ab3db95bfbce` | https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80&auto=format&fit=crop |
| `creator-man-4.jpg` | `photo-1506794778202-cad84cf45f1d` | https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&auto=format&fit=crop |
| `creator-man-5.jpg` | `photo-1508341591423-4347099e1f19` | https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=400&q=80&auto=format&fit=crop |
| `creator-abhishek-singh-chouhan.jpg` | `photo-1519085360753-af0119f7cbe7` | https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&auto=format&fit=crop |
| `creator-nisha-pillai.jpg` | `photo-1438761681033-6461ffad8d80` | https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop |
| `creator-meera-kulkarni.jpg` | `photo-1488426862026-3ee34a7d66df` | https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80&auto=format&fit=crop |
| `creator-fitness-1.jpg` | `photo-1517836357463-d25dfeac3438` | https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80&auto=format&fit=crop |
| `creator-fitness-2.jpg` | `photo-1550345332-09e3ac987658` | https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&q=80&auto=format&fit=crop |
| `creator-yoga-1.jpg` | `photo-1506126613408-eca07ce68773` | https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80&auto=format&fit=crop |
| `creator-athlete-1.jpg` | `photo-1517649763962-0c623066013b` | https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80&auto=format&fit=crop |

## banners/  — hero, featured, category tiles, venues & brands
Source type: External URL (Unsplash). Available now: ✅. Needs real asset for production: ✅

| Local file | Original photo id | Source URL |
|---|---|---|
| `venue-royal-courtyard.jpg` | `photo-1519167758481-83f550bb49b3` | https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80&auto=format&fit=crop |
| `venue-banyan-estate.jpg` | `photo-1470229722913-7c0e2dbbafd3` | https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80&auto=format&fit=crop |
| `brand-aarav-fitness.jpg` | `photo-1571902943202-507ec2618e8f` | https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80&auto=format&fit=crop |
| `brand-kalagram-handlooms.jpg` | `photo-1528605248644-14dd04022da1` | https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80&auto=format&fit=crop |
| `portfolio-cover-abhishek.jpg` | `photo-1493225457124-a3eb161ffa5f` | https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80&auto=format&fit=crop |
| `banner-monsoon-festival.jpg` | `photo-1465847899084-d164df4dedc6` | https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&q=80&auto=format&fit=crop |
| `welcome-collage-dance.jpg` | `photo-1547153760-18fc86324498` | https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&q=80&auto=format&fit=crop |
| `banner-visual-arts.jpg` | `photo-1460661419201-fd4cecdf8a8b` | https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80&auto=format&fit=crop |
| `category-photography.jpg` | `photo-1452587925148-ce544e77e70d` | https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80&auto=format&fit=crop |
| `category-film-media.jpg` | `photo-1489599849927-2ee91cede3ba` | https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80&auto=format&fit=crop |
| `category-literature.jpg` | `photo-1481627834876-b7833e8f5570` | https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80&auto=format&fit=crop |
| `category-fashion.jpg` | `photo-1490481651871-ab68de25d43d` | https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80&auto=format&fit=crop |
| `category-cultural-education.jpg` | `photo-1513475382585-d06e58bcb0e0` | https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&q=80&auto=format&fit=crop |
| `banner-whats-new.jpg` | `photo-1466428996289-fb355538da1b` | https://images.unsplash.com/photo-1466428996289-fb355538da1b?w=1200&q=80&auto=format&fit=crop |
| `banner-open-call-collab.jpg` | `photo-1600880292203-757bb62b4baf` (substitute) | https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop |

> ⚠️ `banner-open-call-collab.jpg`: the **original** app URL
> `https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8` is **BROKEN (HTTP 404)**
> — it is already a dead image in the running app (Featured "Collaborators Wanted"
> slide in `data/featured.ts` and the Collaborate non-active hero in
> `CollaborateHome.tsx`). A working collaboration-themed substitute was downloaded
> so the folder is complete; **the app still needs this URL fixed/replaced.**

## events/  — event & workshop covers
Source type: External URL (Unsplash). Available now: ✅. Needs real asset for production: ✅

| Local file | Original photo id | Source URL |
|---|---|---|
| `event-concert.jpg` | `photo-1459749411175-04bf5292ceea` | https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1000&q=80&auto=format&fit=crop |
| `event-workshop.jpg` | `photo-1513364776144-60967b0f800f` | https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1000&q=80&auto=format&fit=crop |
| `event-music-jam.jpg` | `photo-1501386761578-eac5c94b800a` | https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000&q=80&auto=format&fit=crop |
| `event-ragas.jpg` | `photo-1514320291840-2e0a9bf2a9ae` | https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1000&q=80&auto=format&fit=crop |
| `event-coastal.jpg` | `photo-1552168324-d612d77725e3` | https://images.unsplash.com/photo-1552168324-d612d77725e3?w=1000&q=80&auto=format&fit=crop |
| `event-generic.jpg` | `photo-1524368535928-5b5e00ddc76b` | https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1000&q=80&auto=format&fit=crop |

## products/  — shop product covers
Source type: External URL (Unsplash). Available now: ✅. Needs real asset for production: ✅

| Local file | Original photo id | Source URL |
|---|---|---|
| `product-masterclass-songwriting.jpg` | `photo-1598488035139-bdbb2231ce04` | https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&q=80&auto=format&fit=crop |
| `product-practice-tracks.jpg` | `photo-1470225620780-dba8ba36b745` | https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&q=80&auto=format&fit=crop |
| `product-folk-art-journal.jpg` | `photo-1531346878377-a5be20888e57` | https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=1000&q=80&auto=format&fit=crop |
| `product-tabla-kit.jpg` | `photo-1543443258-92b04ad5ec6b` | https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?w=1000&q=80&auto=format&fit=crop |
| `product-brush-pack.jpg` | `photo-1578321272176-b7bbc0679853` | https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1000&q=80&auto=format&fit=crop |
| `product-masterclass-storytelling.jpg` | `photo-1519389950473-47ba0277781c` | https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&q=80&auto=format&fit=crop |
| `product-digital-pack.jpg` | `photo-1626785774573-4b799315345d` | https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1000&q=80&auto=format&fit=crop |

## portfolios/  — portfolio / creative-work imagery
Source type: External URL (Unsplash). Available now: ✅. Needs real asset for production: ✅

| Local file | Original photo id | Source URL |
|---|---|---|
| `work-music-studio.jpg` | `photo-1511671782779-c97d3d27a1d4` | https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&q=80&auto=format&fit=crop |
| `work-award-recognition.jpg` | `photo-1516280440614-37939bbacd81` | https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1000&q=80&auto=format&fit=crop |
| `work-bharatanatyam.jpg` | `photo-1508700115892-45ecd05ae2ad` | https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1000&q=80&auto=format&fit=crop |
| `work-theatre-stage.jpg` | `photo-1503095396549-807759245b35` | https://images.unsplash.com/photo-1503095396549-807759245b35?w=1000&q=80&auto=format&fit=crop |
| `work-gallery-1.jpg` | `photo-1483393458019-411bc6bd104e` | https://images.unsplash.com/photo-1483393458019-411bc6bd104e?w=1000&q=80&auto=format&fit=crop |

---

## Deduplication notes

150 URL references collapsed to **50 files**. Several photos are reused across
modules; the local file is named by its **primary** role and shared elsewhere:

- `avatars/user-demo-avatar.jpg` (`photo-1489424731084-a5d8b219a5bb`) — profile
  avatar reused in `Profile.tsx`, `EditProfile.tsx`, `AppHeader`/`ProfileAvatarButton`,
  and as `PIC.woman3` in `publicArtists.ts` and `iyer` in `collab/mockCollab.ts`.
- `products/product-practice-tracks.jpg` (`photo-1470225620780-…`) — reused as
  archive "music", explore content, portfolio media, What's New.
- `banners/banner-visual-arts.jpg` (`photo-1460661419201-…`) — reused as demo
  cover, Welcome collage #3, event "paint/canvas", explore category.
- `banners/welcome-collage-dance.jpg` (`photo-1547153760-…`) — Welcome collage #1,
  Featured "Artist Spotlight", demo work.
- `events/event-ragas.jpg` (`photo-1514320291840-…`) — event cover + Welcome
  collage #4 + demo work.
- `products/product-tabla-kit.jpg` (`photo-1543443258-…`) — shop tabla product +
  event "rhythm".

## Broken / expired source URLs

| Original URL | Status | Where in app | Action |
|---|---|---|---|
| `images.unsplash.com/photo-1499781350541-7783f6c6a0c8` | **404 (broken)** | `data/featured.ts` (Open Call slide), `pages/collaborate/CollaborateHome.tsx` (non-active hero) | Fix the URL in code; handoff ships a working substitute as `banners/banner-open-call-collab.jpg` |

All other 49 Unsplash URLs returned HTTP 200 at download time. Being hotlinks,
they remain subject to Unsplash availability/rate-limits and will break offline.

## YouTube thumbnails — NOT downloaded (dynamic)

Generated at runtime by `lib/youtube.ts` → `youTubeThumb(id)`:
`https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg`. Referenced across
`data/archive.ts`, `portfolio/mockPortfolio.ts`, `demo/*`, `PortfolioPreview`,
`ArchiveVideo*`, `MediaEditor`, `SocialEditor`. Distinct video ids in the code:

| Video ID | Watch URL | Generated thumbnail URL |
|---|---|---|
| `9bZkp7q19f0` | https://youtu.be/9bZkp7q19f0 | https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg |
| `L_jWHffIx5E` | https://youtu.be/L_jWHffIx5E | https://img.youtube.com/vi/L_jWHffIx5E/hqdefault.jpg |
| `RgKAFK5djSk` | https://youtu.be/RgKAFK5djSk | https://img.youtube.com/vi/RgKAFK5djSk/hqdefault.jpg |
| `ScMzIvxBSi4` | https://youtu.be/ScMzIvxBSi4 | https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg |
| `aqz-KE-bpKQ` | https://youtu.be/aqz-KE-bpKQ | https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg |
| `dQw4w9WgXcQ` | https://youtu.be/dQw4w9WgXcQ | https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg |
| `e-ORhEE9VVg` | https://youtu.be/e-ORhEE9VVg | https://img.youtube.com/vi/e-ORhEE9VVg/hqdefault.jpg |
| `jNQXAC9IVRw` | https://youtu.be/jNQXAC9IVRw | https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg |
| `kJQP7kiw5Fk` | https://youtu.be/kJQP7kiw5Fk | https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg |
| `ysz5S6PUM-U` | https://youtu.be/ysz5S6PUM-U | https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg |

These are third-party YouTube content — do not redistribute; keep as live
references or replace with owned media for production.

## Excluded (code-drawn, no files)

- Lucide icon components (npm) · inline `<svg>` in `MatchWheel`, `SocialButtons`
  (Google/Spotify logos), `QrCode` · `Avatar` initials fallback.

## Production replacement flag

**Every downloaded file requires a licensed production replacement** — they are
Unsplash demo stand-ins, not owned/cleared media for the real creators, products,
events or venues they represent. Prioritise: real creator avatars, product covers,
and the broken Open-Call banner.
