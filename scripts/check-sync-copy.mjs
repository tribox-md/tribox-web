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

const exposureContracts = {
  en: {
    standard: /\bStandard Sync\b/,
    managed: /provider-managed key wrapping/i,
    notE2ee: /not (?:end-to-end encrypted|E2EE)/i,
    existing: /\bexisting\b/i,
    privateUnavailable: /creating new Private E2EE(?: Sync)? vaults is currently unavailable/i,
    standardServerBoundary: /service manages the wrapping keys/i,
    existingPrivateBoundary: /existing Private E2EE Sync vaults[\s\S]*service cannot decrypt their note content/i,
    vaultModeChooser: /\bvault modes?\b|managed mode by default|mode you choose/i,
  },
  zh: {
    standard: /Standard Sync/,
    managed: /服务端管理的 key wrapping/,
    notE2ee: /不是端到端加密/,
    existing: /已有/,
    privateUnavailable: /当前不提供新建 Private E2EE(?: Sync)? vault/,
    standardServerBoundary: /服务方管理 key wrapping/,
    existingPrivateBoundary: /已有 Private E2EE Sync vault[\s\S]*服务方无法解密其中的笔记内容/,
    vaultModeChooser: /vault 模式|默认托管模式|选择的? ?(?:vault )?模式/,
  },
  ja: {
    standard: /Standard Sync/,
    managed: /サービス管理の key wrapping/,
    notE2ee: /エンドツーエンド暗号化ではありません/,
    existing: /既存/,
    privateUnavailable: /現在、新しい Private E2EE(?: Sync)? vault は作成できません/,
    standardServerBoundary: /サービスが key wrapping を管理/,
    existingPrivateBoundary: /既存の Private E2EE Sync vault[\s\S]*サービスがノート内容を復号することはできません/,
    vaultModeChooser: /vault モード|マネージドモード|選択した.*モード/,
  },
}

function requireContract(value, pattern, failure) {
  if (typeof value !== 'string' || !pattern.test(value)) {
    failures.push(failure)
  }
}

for (const locale of locales) {
  const messages = readMessages(locale)
  const entries = flattenStrings(messages)
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

  const contract = exposureContracts[locale]
  const activeCommercialCopy = [
    ['pricing.pro.features[1]', messages.pricing?.pro?.features?.[1]],
    ['about.promise5Body', messages.about?.promise5Body],
    ['signup.setupNote', messages.signup?.setupNote],
  ]
  for (const [path, value] of activeCommercialCopy) {
    if (typeof value !== 'string') {
      failures.push(`${locale}:${path} must be a string`)
      continue
    }
    if (/Private E2EE/i.test(value)) {
      failures.push(`${locale}:${path} active commercial copy must expose Standard Sync only`)
    }
    requireContract(value, contract.standard, `${locale}:${path} must name Standard Sync`)
    requireContract(value, contract.managed, `${locale}:${path} must state provider-managed key wrapping`)
    requireContract(value, contract.notE2ee, `${locale}:${path} must state that Standard Sync is not E2EE`)
  }

  const standardOnlyFields = [
    ['home.capability4Body', messages.home?.capability4Body, true],
    ['pricing.pro.features[0]', messages.pricing?.pro?.features?.[0], false],
    ['pricing.comparison.rows[5].pro', messages.pricing?.comparison?.rows?.[5]?.pro, true],
    ['about.promise5Title', messages.about?.promise5Title, false],
  ]
  for (const [path, value, requiresBoundary] of standardOnlyFields) {
    requireContract(value, contract.standard, `${locale}:${path} must name Standard Sync`)
    if (requiresBoundary) {
      requireContract(value, contract.managed, `${locale}:${path} must state provider-managed key wrapping`)
      requireContract(value, contract.notE2ee, `${locale}:${path} must state that Standard Sync is not E2EE`)
    }
  }

  const standardOnlySurface = [
    ...messages.pricing.pro.features.map((value, index) => [`pricing.pro.features[${index}]`, value]),
    ['pricing.comparison.rows[5].pro', messages.pricing?.comparison?.rows?.[5]?.pro],
    ...flattenStrings(messages.home, 'home').map(({ path, value }) => [path, value]),
    ...flattenStrings(messages.about, 'about').map(({ path, value }) => [path, value]),
    ...flattenStrings(messages.signup, 'signup').map(({ path, value }) => [path, value]),
  ]
  for (const [path, value] of standardOnlySurface) {
    if (typeof value !== 'string') {
      failures.push(`${locale}:${path} must be a string`)
      continue
    }
    if (/Private E2EE/i.test(value)) {
      failures.push(`${locale}:${path} Standard-only exposure copy must not name Private E2EE`)
    }
    if (contract.vaultModeChooser.test(value)) {
      failures.push(`${locale}:${path} Standard-only exposure copy must not imply a vault-mode chooser`)
    }
  }

  const faq = messages.pricing?.faqs?.[2]?.a
  requireContract(faq, /Private E2EE Sync/, `${locale}:pricing.faqs[2].a must preserve Private E2EE compatibility scope`)
  requireContract(faq, contract.existing, `${locale}:pricing.faqs[2].a must qualify existing Private vault support`)
  requireContract(faq, contract.privateUnavailable, `${locale}:pricing.faqs[2].a must state that new Private creation is unavailable`)

  const privacySyncBoundary = messages.privacy?.section3Body
  requireContract(privacySyncBoundary, contract.standard, `${locale}:privacy.section3Body must name Standard Sync`)
  requireContract(privacySyncBoundary, contract.managed, `${locale}:privacy.section3Body must state provider-managed key wrapping`)
  requireContract(privacySyncBoundary, contract.notE2ee, `${locale}:privacy.section3Body must state that Standard Sync is not E2EE`)
  requireContract(privacySyncBoundary, contract.standardServerBoundary, `${locale}:privacy.section3Body must state the Standard Sync server key boundary`)
  requireContract(privacySyncBoundary, contract.existingPrivateBoundary, `${locale}:privacy.section3Body must limit server-unreadable copy to existing Private vaults`)

  for (const namespace of ['privacy', 'terms']) {
    const namespaceEntries = flattenStrings(messages[namespace], namespace)
    const privateEntries = namespaceEntries.filter(({ value }) => /Private E2EE/i.test(value))
    if (privateEntries.length === 0) {
      failures.push(`${locale}:${namespace} must preserve existing Private E2EE compatibility obligations`)
      continue
    }
    for (const { path, value } of privateEntries) {
      requireContract(value, contract.existing, `${locale}:${path} must qualify Private E2EE as an existing-vault obligation`)
    }
    const namespaceCopy = namespaceEntries.map(({ value }) => value).join('\n')
    requireContract(namespaceCopy, contract.privateUnavailable, `${locale}:${namespace} must state that new Private creation is unavailable`)
  }

  requireContract(messages.account?.syncVaultPrivate, /Private E2EE Sync/, `${locale}:account.syncVaultPrivate must preserve the existing-mode dashboard label`)
  requireContract(messages.account?.syncVaultPrivateDesc, /Private E2EE Sync/, `${locale}:account.syncVaultPrivateDesc must preserve Private E2EE compatibility copy`)
  requireContract(messages.account?.syncVaultPrivateDesc, contract.existing, `${locale}:account.syncVaultPrivateDesc must identify an existing Private vault`)
}

if (failures.length > 0) {
  console.error('Sync copy gate failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('Sync copy gate passed.')
