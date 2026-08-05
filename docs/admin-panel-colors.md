# IICA Admin Panel — Colour Reference

> **Scope note:** This repository (`iica-mobile-app-prototype`) contains the
> **User App only**. There is **no Admin Panel project in this repo**, so its
> colours cannot be audited from source here. Values below are **not** derived
> from an admin codebase — they are the **shared IICA brand base** (the same
> tokens the User App uses), provided so the admin project can adopt a
> consistent, separate palette.
>
> When the Admin Panel source is available, re-run the audit inside that project
> and replace this file with real, counted values (variable, class, usage,
> example screen, occurrences) exactly as done in `user-app-colors.md`.

Audited User-App base (source of truth for the shared brand): `tailwind.config.js`.

---

## Shared brand base (reference only — verify in the admin project)

| Semantic name | HEX | RGB | Notes |
|---|---|---|---|
| Brand primary | `#9D2567` | `rgb(157, 37, 103)` | Primary actions, active nav |
| Brand dark (hover) | `#592049` | `rgb(89, 32, 73)` | Hover/pressed |
| Brand soft | `#F8EDF3` | `rgb(248, 237, 243)` | Tinted surfaces |
| Page background | `#FAFAF8` | `rgb(250, 250, 248)` | App/page bg |
| Surface | `#FFFFFF` | `rgb(255, 255, 255)` | Cards, panels, tables |
| Text primary | `#191718` | `rgb(25, 23, 24)` | Headings/body |
| Text secondary | `#706B6E` | `rgb(112, 107, 110)` | Secondary text |
| Border / divider | `#E8E4E6` | `rgb(232, 228, 230)` | Rules, inputs, table lines |
| Success | `#227A52` | `rgb(34, 122, 82)` | Approved / active |
| Success soft | `#EAF3EE` | `rgb(234, 243, 238)` | Success pill bg |
| Warning | `#B77818` | `rgb(183, 120, 24)` | Pending / review |
| Warning soft | `#F7F0E4` | `rgb(247, 240, 228)` | Warning pill bg |
| Error | `#B83A42` | `rgb(184, 58, 66)` | Rejected / destructive |
| Error soft | `#F7E9EA` | `rgb(247, 233, 234)` | Error pill bg |
| Overlay | `rgba(25, 23, 24, 0.40)` | — | Modal scrim |
| Subtle shadow | `rgba(25, 23, 24, 0.04)` | — | Card elevation |

---

## Admin-specific colours

Unknown — not present in this repository. Admin dashboards typically add chart
palettes, data-table zebra rows, and role/permission status colours. Capture
those directly from the admin codebase during its own audit; do not copy them
speculatively from the User App.

Grouped placeholders to fill during the admin audit:

- **Brand** — inherit shared base above.
- **Backgrounds and surfaces** — page bg, sidebar, top bar, table surface, zebra rows.
- **Text** — primary, secondary, disabled, link.
- **Borders and dividers** — table lines, input borders, focus ring.
- **Buttons and navigation** — primary/secondary/ghost/destructive, sidebar active/inactive.
- **Status colours** — approve/reject/pending/flagged (map to success/warning/error).
- **Icons** — action icons, status icons.
- **Charts** — categorical + sequential palettes (audit the charting lib in use).
- **Overlays and shadows** — modal scrim, dropdown/card elevation.
- **Gradients** — any header/hero gradients.

Token starter for the admin project lives in `src/styles/admin-colors.css`.
