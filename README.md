# tribox-web

Marketing site and snapshot-share landing pages for **tribox** —
a local-first notes & knowledge management desktop application.

🌐 **Live:** [tribox.md](https://tribox.md) · [中文](https://tribox.md/zh) · [日本語](https://tribox.md/ja)

---

## Routes

| Path | Purpose |
|------|---------|
| `/` | Marketing homepage — five product promises + capabilities |
| `/pricing` | Free + Pro ($9/mo or $90/year) + AI credit pack ($10) + Commercial |
| `/download` | Desktop client (macOS / Windows) + mobile (in development) |
| `/about` | Team, philosophy, business model |
| `/privacy` `/terms` `/refund` | Legal pages (Stripe-ready) |
| `/login` `/signup` | Redirect to the dedicated account portal (`NEXT_PUBLIC_ACCOUNT_ORIGIN`) |
| `/account` | Redirect to the dedicated account portal (`NEXT_PUBLIC_ACCOUNT_ORIGIN`) |
| `/join/[token]` | Snapshot-share invite landing |
| `/onboarding` | 4-step new-user flow |

All routes are served under `/[locale]/...` with three supported languages
(English default, 中文, 日本語) and `Accept-Language` auto-detection.

## Tech stack

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** TailwindCSS 3
- **i18n:** [next-intl](https://next-intl.dev) 4.x
- **Cryptography:** [@noble/hashes](https://github.com/paulmillr/noble-hashes)
  (client-side Argon2id key derivation for sign-in)
- **Hosting:** Vercel

## Quick start

```bash
git clone https://github.com/tribox-md/tribox-web.git
cd tribox-web
npm install
cp .env.local.example .env.local   # then fill in values, see below
npm run dev                        # http://localhost:3000
```

## Environment variables

All variables are exposed to the browser (`NEXT_PUBLIC_` prefix).

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for sitemap / OG / metadata | `https://tribox.md` |
| `NEXT_PUBLIC_API_BASE_URL` | Backend HTTP API base for public/share-link features | `https://api.tribox.md` |
| `NEXT_PUBLIC_ACCOUNT_ORIGIN` | Dedicated account portal origin | `https://account.tribox.md` |
| `NEXT_PUBLIC_APP_SCHEME` | Custom URL scheme for desktop app deep-link | `tribox` |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY` | Optional public Stripe price ID for Pro monthly checkout selection | `price_...` |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY` | Public Stripe price ID for Pro yearly checkout selection | `price_...` |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_AI_CREDIT_PACK` | Optional public Stripe price ID for AI credit pack checkout selection | `price_...` |
| `NEXT_PUBLIC_RELEASE_BASE_URL` | GitHub Release base URL for installer downloads | `https://github.com/tribox-md/tribox-desktop/releases/download/v1.0.0` |
| `NEXT_PUBLIC_RELEASE_VERSION` | Current desktop release version | `1.0.0` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js publishable key (optional, future use) | `pk_live_...` |

The download page gracefully falls back to a "coming soon" placeholder when
`NEXT_PUBLIC_RELEASE_BASE_URL` / `_VERSION` are not configured.

## Deploying

Push to `master` → Vercel auto-deploys. The free **Hobby** plan is sufficient
because the repository is public.

M0 website launch evidence lives in
[`docs/M0-VERCEL-LAUNCH-RUNBOOK.md`](docs/M0-VERCEL-LAUNCH-RUNBOOK.md). Run
`npm run -s check:m0-web-legal` before promoting a Vercel deployment.

For self-hosting:

```bash
npm run build
npm run start   # serves on PORT, default 3000
```

## Backend dependency

Account features (login, signup, account, billing) live in the dedicated
`tribox-account` deployment. The public website redirects `/login`, `/signup`,
and `/account` to `NEXT_PUBLIC_ACCOUNT_ORIGIN` so the marketing site does not
store account tokens or run account KDF/sign-in flows.

## Project layout

```
app/                       Next.js App Router
  [locale]/                Locale-scoped pages (en | zh | ja)
  layout.tsx               Root passthrough layout
  globals.css              Tailwind entry
  icon.png                 Favicon (auto-served)
components/                React components (server + client)
i18n/                      next-intl routing / request config
lib/                       API clients (auth / account / billing / downloads)
messages/                  Translation files (en.json / zh.json / ja.json)
middleware.ts              Locale detection & redirect
```

## License

[MIT](./LICENSE) © 2026 tribox

## Related

- [tribox-md](https://github.com/tribox-md) — GitHub organization
- Backend (open source, separate repo)
- Desktop client (in development)
