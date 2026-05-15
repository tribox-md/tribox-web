'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { useTransition } from 'react'

const LOCALE_LABEL: Record<Locale, string> = {
  en: 'EN',
  zh: '中',
  ja: '日',
}

const LOCALE_NAME: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
}

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function handleChange(next: Locale) {
    if (next === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value as Locale)}
        disabled={isPending}
        aria-label="Language"
        className="appearance-none rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 pr-7 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="bg-[#0f0f1a]">
            {LOCALE_LABEL[l]} · {LOCALE_NAME[l]}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
        ▾
      </span>
    </div>
  )
}
