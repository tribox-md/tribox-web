import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'signup' })
  return { title: t('title') }
}

export default async function SignupPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <SignupContent />
}

function SignupContent() {
  const t = useTranslations('signup')

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 text-2xl">
              💻
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">{t('title')}</h1>
            <p className="text-slate-400 text-sm leading-relaxed">{t('subtitle')}</p>
          </div>

          <ol className="space-y-4 mb-8 text-sm">
            <Step n={1} title={t('step1Title')} body={t('step1Body')} />
            <Step n={2} title={t('step2Title')} body={t('step2Body')} />
            <Step n={3} title={t('step3Title')} body={t('step3Body')} />
          </ol>

          <div className="flex flex-col gap-3">
            <Link
              href="/download"
              className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-center text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/20"
            >
              {t('ctaDownload')}
            </Link>
            <Link
              href="/login"
              className="w-full rounded-xl border border-white/20 hover:border-white/40 px-6 py-3 text-center text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              {t('ctaLogin')}
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 leading-relaxed">
          {t('whyNoWebSignup')}
          <br />
          {t('whyBody')}
        </p>
      </div>
    </div>
  )
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
        {n}
      </div>
      <div>
        <div className="font-semibold text-white mb-0.5">{title}</div>
        <div className="text-slate-400 leading-relaxed">{body}</div>
      </div>
    </li>
  )
}
