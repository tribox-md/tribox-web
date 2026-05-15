import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('title') }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AboutContent />
}

function AboutContent() {
  const t = useTranslations('about')

  return (
    <div className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">{t('intro')}</p>
        </div>

        <Section title={t('whyTitle')}>
          <p dangerouslySetInnerHTML={{ __html: renderInline(t('whyBody')) }} />
        </Section>

        <Section title={t('promisesTitle')}>
          <p>{t('promisesIntro')}</p>
          <ul className="list-disc pl-5 space-y-2.5 text-slate-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i}>
                <strong className="text-slate-200">{t(`promise${i}Title`)}</strong>{' '}
                {t(`promise${i}Body`)}
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t('businessTitle')}>
          <p>{t('businessIntro')}</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>{t('businessSync')}</li>
            <li>{t('businessCatalyst')}</li>
            <li>{t('businessCommercial')}</li>
          </ul>
          <p>{t('businessClosing')}</p>
        </Section>

        <Section title={t('contactTitle')}>
          <ul className="space-y-2 text-slate-400">
            <li>
              {t('contactEmail')}{' '}
              <a
                href="mailto:hello@tribox.md"
                className="text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                hello@tribox.md
              </a>
            </li>
            <li>
              {t('contactBusiness')}{' '}
              <a
                href="mailto:hello@tribox.md?subject=Commercial%20License"
                className="text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                hello@tribox.md
              </a>
            </li>
            <li>
              {t('contactGithub')}{' '}
              <a
                href="https://github.com/tribox-md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                github.com/tribox-md
              </a>
            </li>
          </ul>
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
    <section className="mb-14">
      <h2 className="text-2xl font-semibold text-white mb-5 tracking-tight">{title}</h2>
      <div className="space-y-4 text-slate-400 leading-relaxed">{children}</div>
    </section>
  )
}

function renderInline(text: string): string {
  return text.replace(/<strong>(.+?)<\/strong>/g, '<strong class="text-slate-200">$1</strong>')
}
