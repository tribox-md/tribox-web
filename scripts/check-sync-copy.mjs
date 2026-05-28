#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
const failures = []
const locales = ['en', 'zh', 'ja']

function readMessages(locale) {
  return JSON.parse(readFileSync(resolve(root, `messages/${locale}.json`), 'utf8'))
}

function flattenStrings(value, path = '', out = []) {
  if (typeof value === 'string') {
    out.push({ path, value })
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => flattenStrings(item, `${path}[${index}]`, out))
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      flattenStrings(item, path ? `${path}.${key}` : key, out)
    }
  }
  return out
}

const standardSync = /Standard Sync|托管同步|標準.*Sync|マネージドモード|managed mode/i
const privateE2ee = /Private E2EE Sync/i
const e2eeClaim = /E2EE|E2E encrypted|E2E 加密|E2E 暗号化|zero-knowledge|零知识|ゼロ知識/i
const ai = /\bAI\b|Hosted AI|AI credit|AI credits|AI Copilot/i
const aiE2eeExclusion = /not part of the E2EE promise|不属于 E2EE 承诺范围|E2EE の約束には含まれません/i
const privateScope = /Private E2EE Sync/

for (const locale of locales) {
  const entries = flattenStrings(readMessages(locale))
  for (const { path, value } of entries) {
    if (standardSync.test(value) && e2eeClaim.test(value) && !privateE2ee.test(value)) {
      failures.push(`${locale}:${path} Standard Sync copy must not claim E2EE/zero-knowledge: ${value}`)
    }

    if (privateE2ee.test(value) && !privateScope.test(value)) {
      failures.push(`${locale}:${path} Private E2EE copy must explicitly name Private E2EE Sync scope: ${value}`)
    }

    if (ai.test(value) && e2eeClaim.test(value) && !aiE2eeExclusion.test(value)) {
      failures.push(`${locale}:${path} AI copy must not be merged into E2EE promises: ${value}`)
    }
  }
}

if (failures.length > 0) {
  console.error('Sync copy gate failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('Sync copy gate passed.')
