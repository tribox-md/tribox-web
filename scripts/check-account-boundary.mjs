import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dirname, '..')
const retiredSurfaces = [
  'app/[locale]/login/page.tsx',
  'app/[locale]/signup/page.tsx',
  'app/[locale]/account/page.tsx',
  'components/LoginForm.tsx',
  'components/SignupForm.tsx',
  'components/AccountDashboard.tsx',
]
const findings = retiredSurfaces
  .filter(path => existsSync(join(root, path)))
  .map(path => `retired web account surface returned: ${path}`)

const extensions = new Set(['.js', '.mjs', '.ts', '.tsx'])
const forbidden = [
  /argon2id/i,
  /deriveServerPassword/,
  /\/api\/v1\/auth\/(?:login|signup|params)/,
]

function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      scan(path)
    } else if (entry.isFile() && extensions.has(extname(entry.name))) {
      const source = readFileSync(path, 'utf8')
      for (const pattern of forbidden) {
        if (pattern.test(source)) {
          findings.push(`web credential implementation is forbidden: ${relative(root, path)} (${pattern})`)
        }
      }
    }
  }
}

for (const sourceRoot of ['app', 'components', 'lib']) scan(join(root, sourceRoot))

const nextConfig = readFileSync(join(root, 'next.config.mjs'), 'utf8')
for (const redirect of [
  "source: '/login', destination: `${ACCOUNT_ORIGIN}/login`",
  "source: '/signup', destination: `${ACCOUNT_ORIGIN}/signup`",
  "source: '/account', destination: `${ACCOUNT_ORIGIN}/account`",
  "source: '/:locale(en|zh|ja)/login', destination: `${ACCOUNT_ORIGIN}/:locale/login`",
  "source: '/:locale(en|zh|ja)/signup', destination: `${ACCOUNT_ORIGIN}/:locale/signup`",
  "source: '/:locale(en|zh|ja)/account', destination: `${ACCOUNT_ORIGIN}/:locale/account`",
]) {
  if (!nextConfig.includes(redirect)) findings.push(`account-origin redirect missing: ${redirect}`)
}

if (findings.length > 0) {
  console.error(`Account boundary failed:\n- ${findings.join('\n- ')}`)
  process.exitCode = 1
} else {
  console.log('Account boundary passed: tribox-web delegates credentials and account UI to ACCOUNT_ORIGIN.')
}
