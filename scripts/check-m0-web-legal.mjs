#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
const failures = []

function read(path) {
  return readFileSync(resolve(root, path), 'utf8')
}

function requireFile(path) {
  if (!existsSync(resolve(root, path))) {
    failures.push(`${path} must exist`)
  }
}

function requireMatch(path, pattern, message) {
  const source = read(path)
  if (!pattern.test(source)) {
    failures.push(message)
  }
}

function requireMessage(locale, path) {
  const messages = JSON.parse(read(`messages/${locale}.json`))
  let current = messages
  for (const key of path.split('.')) {
    current = current?.[key]
  }
  if (typeof current !== 'string' || current.trim().length === 0) {
    failures.push(`messages/${locale}.json must define ${path}`)
  }
}

function requireMessageNamespace(locale, namespace) {
  const messages = JSON.parse(read(`messages/${locale}.json`))
  const value = messages[namespace]
  if (!value || typeof value !== 'object') {
    failures.push(`messages/${locale}.json must define ${namespace}`)
    return
  }
  for (const key of ['title', 'summary', 'sections', 'backHome']) {
    if (!(key in value)) {
      failures.push(`messages/${locale}.json must define ${namespace}.${key}`)
    }
  }
}

function stringValues(value, out = []) {
  if (typeof value === 'string') {
    out.push(value)
  } else if (Array.isArray(value)) {
    for (const item of value) stringValues(item, out)
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) stringValues(item, out)
  }
  return out
}

for (const path of [
  'app/[locale]/privacy/page.tsx',
  'app/[locale]/terms/page.tsx',
  'app/[locale]/cookie/page.tsx',
  'app/[locale]/subprocessors/page.tsx',
  'app/[locale]/refund/page.tsx',
  'app/[locale]/billing/success/page.tsx',
  'app/[locale]/billing/cancel/page.tsx',
  'docs/M0-VERCEL-LAUNCH-RUNBOOK.md',
]) {
  requireFile(path)
}

for (const route of ['/privacy', '/terms', '/cookie', '/subprocessors', '/refund']) {
  requireMatch(
    'app/[locale]/layout.tsx',
    new RegExp(`href="${route}"`),
    `footer must link to ${route}`,
  )
  requireMatch(
    'app/sitemap.ts',
    new RegExp(`\\$\\{SITE_URL\\}${route}`),
    `sitemap must include ${route}`,
  )
}

for (const route of ['/billing/success', '/billing/cancel']) {
  requireMatch(
    'app/sitemap.ts',
    new RegExp(`\\$\\{SITE_URL\\}${route}`),
    `sitemap must include ${route}`,
  )
}

for (const [legacyRoute, destination] of [
  ['/legal/privacy', '/privacy'],
  ['/legal/terms', '/terms'],
  ['/legal/cookie', '/cookie'],
  ['/legal/subprocessors', '/subprocessors'],
]) {
  requireMatch(
    'next.config.mjs',
    new RegExp(`source:\\s*'${legacyRoute}'.*destination:\\s*'${destination}'`),
    `next.config.mjs must redirect ${legacyRoute} to ${destination}`,
  )
}

for (const locale of ['en', 'zh', 'ja']) {
  const rawMessages = read(`messages/${locale}.json`)
  const publicCopy = stringValues(JSON.parse(rawMessages)).join('\n')
  if (/\bM0\b/.test(rawMessages)) {
    failures.push(`messages/${locale}.json must not expose internal phase name M0 in public copy`)
  }
  if (/\$4-5|\$4–5|\$35|Catalyst|14-day|14 days|14 天|14 日間|14 日以内|14 日/.test(publicCopy)) {
    failures.push(`messages/${locale}.json must not expose retired pricing/refund copy`)
  }
  for (const key of ['footer.privacy', 'footer.terms', 'footer.cookie', 'footer.subprocessors', 'footer.refund']) {
    requireMessage(locale, key)
  }
  requireMessageNamespace(locale, 'cookie')
  requireMessageNamespace(locale, 'subprocessors')
  for (const path of [
    'billingReturn.success.title',
    'billingReturn.success.body',
    'billingReturn.cancel.title',
    'billingReturn.cancel.body',
  ]) {
    requireMessage(locale, path)
  }
}

requireMatch(
  'lib/analytics.ts',
  /NEXT_PUBLIC_ANALYTICS_ENABLED\s*===\s*'true'/,
  'analytics must be disabled by default and require NEXT_PUBLIC_ANALYTICS_ENABLED=true',
)
requireMatch(
  'lib/analytics.ts',
  /localStorage\.getItem\(ANALYTICS_CONSENT_KEY\)\s*===\s*'granted'/,
  'analytics must require explicit local consent before sending',
)
requireMatch(
  'components/PricingPage.tsx',
  /priceMonthly:\s*'\$9'[\s\S]*priceAnnual:\s*'\$90'[\s\S]*priceOneTime:\s*'\$10'/,
  'pricing page must expose current M0 prices: Pro $9/month, Pro $90/year, AI credit pack $10',
)
requireMatch(
  'components/PricingPage.tsx',
  /NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY/,
  'pricing page must use the public yearly Stripe price ID for annual checkout selection',
)
requireMatch(
  'messages/en.json',
  /7 days of purchase/,
  'English refund copy must use the 7-day purchase window',
)
requireMatch(
  'messages/zh.json',
  /购买后 7 天/,
  'Chinese refund copy must use the 7-day purchase window',
)
requireMatch(
  'messages/ja.json',
  /購入から 7 日/,
  'Japanese refund copy must use the 7-day purchase window',
)
requireMatch(
  'docs/M0-VERCEL-LAUNCH-RUNBOOK.md',
  /WEB-01[\s\S]*WEB-07/,
  'Vercel launch runbook must track WEB-01 through WEB-07',
)
requireMatch(
  'docs/M0-VERCEL-LAUNCH-RUNBOOK.md',
  /NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY/,
  'Vercel launch runbook must document the public yearly Stripe price ID env var',
)

if (failures.length > 0) {
  console.error('M0 web legal gate failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('M0 web legal gate passed.')
