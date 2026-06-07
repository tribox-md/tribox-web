import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { accountPath } from '@/lib/account-origin'

export function BillingReturnPage({ status, locale }: { status: 'success' | 'cancel'; locale: string }) {
  const t = useTranslations(`billingReturn.${status}`)

  return (
    <div className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-3">
          {t('eyebrow')}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
          {t('title')}
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed mb-10">{t('body')}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={accountPath('/account', locale)}
            className="rounded-xl bg-indigo-500 hover:bg-indigo-400 px-5 py-3 text-sm font-semibold text-white transition-colors"
          >
            {t('accountCta')}
          </a>
          <Link
            href="/pricing"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5 transition-colors"
          >
            {t('pricingCta')}
          </Link>
        </div>
      </div>
    </div>
  )
}
