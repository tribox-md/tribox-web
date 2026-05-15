import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

const LAST_UPDATED = '2026-05-15'

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  return { title: t('title') }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <PrivacyContent />
}

function PrivacyContent() {
  const t = useTranslations('privacy')

  return (
    <div className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-3">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-slate-500 text-sm">
            {t('lastUpdated')} {LAST_UPDATED}
          </p>
        </div>

        <div className="mb-12 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6">
          <h2 className="text-lg font-semibold text-indigo-200 mb-3">{t('tldrTitle')}</h2>
          <p className="text-slate-300 leading-relaxed">{t('tldrBody')}</p>
        </div>

        <Section title={t('section1Title')}>
          <p>{t('section1Body')}</p>
          <ul>
            {(t.raw('section1List') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>
            <strong className="text-slate-200">{t('section1Note')}</strong>
          </p>
        </Section>

        <Section title={t('section2Title')}>
          <p>{t('section2Body')}</p>
          <ul>
            {(t.raw('section2List') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{t('section2Note')}</p>
        </Section>

        <Section title={t('section3Title')}>
          <p>{t('section3Body')}</p>
          <ul>
            {(t.raw('section3List') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('section4Title')}>
          <p>{t('section4Body')}</p>
          <ul>
            {(t.raw('section4List') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>
            {t('section4Stripe')}{' '}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              stripe.com/privacy
            </a>
          </p>
        </Section>

        <Section title={t('section5Title')}>
          <p>{t('section5Body')}</p>
          <ul>
            {(t.raw('section5List') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{t('section5Note')}</p>
        </Section>

        <Section title={t('section6Title')}>
          <p>{t('section6Body')}</p>
          <ul>
            {(t.raw('section6List') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('section7Title')}>
          <p>
            {t('section7Body')}{' '}
            <a
              href="mailto:privacy@tribox.md"
              className="text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              privacy@tribox.md
            </a>
          </p>
        </Section>

        <div className="mt-16 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            {t('backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">{title}</h2>
      <div className="space-y-4 text-slate-400 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:my-3">
        {children}
      </div>
    </section>
  )
}
