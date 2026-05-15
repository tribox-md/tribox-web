import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

const LAST_UPDATED = '2026-05-15'

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'refund' })
  return { title: t('title') }
}

export default async function RefundPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <RefundContent />
}

function RefundContent() {
  const t = useTranslations('refund')

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
          <h2 className="text-lg font-semibold text-indigo-200 mb-3">{t('summaryTitle')}</h2>
          <ul className="text-slate-300 leading-relaxed space-y-2 list-disc pl-5">
            {(t.raw('summaryList') as string[]).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: renderMd(item) }} />
            ))}
          </ul>
        </div>

        <Section title={t('section1Title')}>
          <h3 className="text-base font-semibold text-slate-200 mb-2">{t('section1Sub1')}</h3>
          <p dangerouslySetInnerHTML={{ __html: renderInline(t('section1Body1')) }} />

          <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">{t('section1Sub2')}</h3>
          <p dangerouslySetInnerHTML={{ __html: renderInline(t('section1Body2')) }} />

          <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">{t('section1Sub3')}</h3>
          <p>{t('section1Body3')}</p>
          <ul>
            {(t.raw('section1Body3List') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{t('section1Body3End')}</p>
        </Section>

        <Section title={t('section2Title')}>
          <p dangerouslySetInnerHTML={{ __html: renderInline(t('section2Body')) }} />
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
              <li key={i} dangerouslySetInnerHTML={{ __html: renderMd(item) }} />
            ))}
          </ul>
          <p dangerouslySetInnerHTML={{ __html: renderInline(t('section3Note')) }} />
        </Section>

        <Section title={t('section4Title')}>
          <h3 className="text-base font-semibold text-slate-200 mb-2">{t('section4Sub1')}</h3>
          <p>{t('section4Body1')}</p>

          <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">{t('section4Sub2')}</h3>
          <p>{t('section4Body2')}</p>

          <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">{t('section4Sub3')}</h3>
          <p>{t('section4Body3')}</p>
        </Section>

        <Section title={t('section5Title')}>
          <p>
            {t('section5Body')}{' '}
            <a
              href="mailto:hello@tribox.md?subject=Refund%20Request"
              className="text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              hello@tribox.md
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

function renderInline(text: string): string {
  return text.replace(/<strong>(.+?)<\/strong>/g, '<strong class="text-slate-200">$1</strong>')
}

function renderMd(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-200">$1</strong>')
}
