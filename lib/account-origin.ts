import { routing, type Locale } from '@/i18n/routing'

export const ACCOUNT_ORIGIN =
  process.env.NEXT_PUBLIC_ACCOUNT_ORIGIN?.replace(/\/$/, '') ?? 'https://account.tribox.md'

export function accountPath(path: string, locale?: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const localePrefix =
    locale && locale !== routing.defaultLocale && routing.locales.includes(locale as Locale)
      ? `/${locale}`
      : ''
  return `${ACCOUNT_ORIGIN}${localePrefix}${normalizedPath}`
}
