import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tribox.md'

const LOCALE_OG: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
  ja: 'ja_JP',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: `%s · tribox`,
    },
    description: t('description'),
    keywords: t('keywords').split(','),
    authors: [{ name: 'tribox' }],
    creator: 'tribox',
    publisher: 'tribox',
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: 'website',
      locale: LOCALE_OG[locale as Locale] ?? 'en_US',
      url: SITE_URL,
      siteName: 'tribox',
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('descriptionShort'),
    },
    alternates: {
      canonical: locale === routing.defaultLocale ? '/' : `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l === 'en' ? 'en' : l === 'zh' ? 'zh-CN' : 'ja-JP',
          l === routing.defaultLocale ? '/' : `/${l}`,
        ]),
      ),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'nav' })
  const tFooter = await getTranslations({ locale, namespace: 'footer' })

  const htmlLang = locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en'

  return (
    <html lang={htmlLang}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0f0f1a] text-slate-100">
        <NextIntlClientProvider>
          {/* 顶部导航 */}
          <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f0f1a]/80 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icon.png"
                    alt="tribox"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-lg"
                  />
                  <span className="text-white">tribox</span>
                </Link>

                <nav className="flex items-center gap-1 sm:gap-2">
                  <Link
                    href="/pricing"
                    className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    {t('pricing')}
                  </Link>
                  <Link
                    href="/about"
                    className="hidden sm:inline-block px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    {t('about')}
                  </Link>
                  <Link
                    href="/account"
                    className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    {t('account')}
                  </Link>
                  <LanguageSwitcher />
                  <Link
                    href="/download"
                    className="ml-1 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-sm font-semibold text-white transition-colors"
                  >
                    {t('download')}
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-white/10 py-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8 text-sm">
                <div>
                  <h3 className="font-semibold text-white mb-3">{tFooter('product')}</h3>
                  <ul className="space-y-2 text-slate-400">
                    <li>
                      <Link href="/download" className="hover:text-white transition-colors">
                        {t('download')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/pricing" className="hover:text-white transition-colors">
                        {t('pricing')}
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3">{tFooter('about')}</h3>
                  <ul className="space-y-2 text-slate-400">
                    <li>
                      <Link href="/about" className="hover:text-white transition-colors">
                        {tFooter('aboutLink')}
                      </Link>
                    </li>
                    <li>
                      <a
                        href="https://github.com/tribox-md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        GitHub
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3">{tFooter('legal')}</h3>
                  <ul className="space-y-2 text-slate-400">
                    <li>
                      <Link href="/privacy" className="hover:text-white transition-colors">
                        {tFooter('privacy')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="hover:text-white transition-colors">
                        {tFooter('terms')}
                      </Link>
                    </li>
                    <li>
                      <Link href="/refund" className="hover:text-white transition-colors">
                        {tFooter('refund')}
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-3">{tFooter('contact')}</h3>
                  <ul className="space-y-2 text-slate-400">
                    <li>
                      <a
                        href="mailto:hello@tribox.md"
                        className="hover:text-white transition-colors"
                      >
                        hello@tribox.md
                      </a>
                    </li>
                    <li>
                      <a
                        href="mailto:privacy@tribox.md"
                        className="hover:text-white transition-colors"
                      >
                        privacy@tribox.md
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5 text-xs text-slate-500">
                <p>© {new Date().getFullYear()} tribox. {tFooter('tagline')}</p>
                <p>{tFooter('builtWith')}</p>
              </div>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
