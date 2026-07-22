# IICA Mobile App Prototype

A high-fidelity, fully clickable mobile app prototype for **IICA — International Indian Culture & Arts**, a membership-based platform for artists and creators to build portfolios, sell events and products, share content, and discover collaborators.

The app is presented inside a realistic mobile device frame on desktop/tablet and runs full-bleed on real mobile viewports (designed for a 390 × 844 screen).

## Prototype modules

- **Authentication & onboarding** — welcome, sign up, email verification, sign in, forgot password
- **Creator membership** — application form, unique IICA ID generation, and an **external membership-payment simulation** (payment happens outside the app via an emailed link)
- **Portfolio Builder** — 13-section builder with autosave, preview, publish and share
- **Public Artist Portfolio** — the published profile guests and creators see, plus reviews, collaboration requests, media and event sub-flows
- **Events** — discovery, details, free registration, paid ticketing & checkout (simulated), My Tickets, and full creator event management (create, dashboard, attendees, cancel)
- **Explore** — discovery home, artists, events, content, shop preview, global search, category pages, saved items and personalisation

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React (icons)

State is held in React context and persisted to `localStorage`. There is no backend.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Prototype credentials

- **Sign in:** any valid email + a password of at least 6 characters
- **Email / review / registration OTP:** `123456`
- **Checkout promo code:** `IICA10`
- **Login shortcuts:** Continue as Guest · Preview Payment Pending Member · Preview Active Creator
- **Checkout:** demo *Simulate Successful Payment* / *Simulate Failed Payment* controls

## Important notes

- Payments, emails, OTP verification, media uploads, QR codes and external links are all **simulated locally** — no real gateway, mail service, file storage or personal data is used.
- All artist, event and user data is fictional mock data.
- This is a **client prototype for demonstration purposes only** and is **not a production application**. It has no backend, authentication server, or payment integration.
