# M0 Vercel Launch Runbook

**Status**: Active launch runbook
**Last Updated**: 2026-05-19
**Scope**: tribox public website on Vercel

This document is the landing place for website-side manual launch work. It does
not create new product scope. Code changes still happen in this repository and
deploy through GitHub -> Vercel.

## Automated Gates

Run before merging or promoting a Vercel deployment:

```bash
npm run -s check:m0-web-legal
npm run type-check
npm run build
```

Clear pass condition:

- `/privacy`, `/terms`, `/cookie`, `/subprocessors`, and `/refund` exist.
- `/legal/privacy`, `/legal/terms`, `/legal/cookie`, and `/legal/subprocessors`
  redirect to the canonical public pages used by the desktop app links.
- Footer links expose Privacy, Terms, Cookie Notice, Sub-processors, and Refund.
- Sitemap includes all public legal pages.
- Product analytics is disabled by default and requires explicit consent before sending.
- `/billing/success` and `/billing/cancel` exist for Stripe Checkout redirects.
- Pricing page displays Pro `$9/month`, Pro `$90/year`, AI credit pack `$10`, and a 7-day Pro refund window.
- English, Chinese, and Japanese message files contain the legal footer and page namespaces.

## Manual Vercel / Website Tasks

| ID | Task | Owner action | Clear pass condition | Evidence artifact |
|---|---|---|---|---|
| WEB-01 | GitHub deployment | Push `master` to GitHub and let Vercel build | Vercel production deployment succeeds from the intended commit | Vercel deployment URL + commit SHA |
| WEB-02 | Domain routing | Confirm `tribox.md` and localized routes resolve on HTTPS | `/`, `/zh`, `/ja`, and legal pages return 200 over HTTPS | Browser screenshots or `curl -I` output |
| WEB-03 | Legal pages | Review `/privacy`, `/terms`, `/cookie`, `/subprocessors`, `/refund`, and `/legal/*` redirects | Footer links work in all locales, desktop app legal URLs do not 404, and pages match the M0 service surface | URL list + screenshots |
| WEB-04 | Analytics decision | Keep `NEXT_PUBLIC_ANALYTICS_ENABLED` unset/false for M0, or enable only with a visible consent path | No analytics request is sent before consent; if disabled, no consent banner is required | Vercel env screenshot or browser network evidence |
| WEB-05 | API URL + public Stripe price IDs | Confirm `NEXT_PUBLIC_API_BASE_URL` points at the intended sync-server environment and `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY` is set for yearly Checkout selection; optionally set monthly and credit-pack public price IDs too | Login, account, billing, and invite flows call the intended API host; annual Checkout cannot silently fall back to monthly | Vercel env screenshot with values redacted |
| WEB-06 | Stripe redirects | Configure Stripe success/cancel URLs to `https://tribox.md/billing/success` and `https://tribox.md/billing/cancel` or equivalent deployed public routes | Hosted Checkout returns to a non-404 public website URL for both payment completion and cancellation | Stripe dashboard screenshot / Checkout session |
| WEB-07 | Final copy smoke | Check public pricing, AI, sync, privacy, and E2EE claims against M0 wording | No zero-knowledge overclaim, no unsupported region claim, no request-count pricing promise | Reviewer sign-off |

## Stop Rules

- Do not enable analytics on Vercel unless the consent path is visible and tested.
- Do not mark WEB-03 complete if a legal link returns 404 in any locale.
- Do not change Stripe/OpenRouter/server secrets in this repo. Keep those in Vercel or server secret stores only.
- If a Vercel deployment fails, fix the smallest website issue first; do not expand launch scope.

## Evidence Log

| ID | Status | Artifact | Reviewer | Notes |
|---|---|---|---|---|
| WEB-01 | Pending |  |  |  |
| WEB-02 | Pending |  |  |  |
| WEB-03 | Pending |  |  |  |
| WEB-04 | Pending |  |  |  |
| WEB-05 | Pending |  |  |  |
| WEB-06 | Pending |  |  |  |
| WEB-07 | Pending |  |  |  |
