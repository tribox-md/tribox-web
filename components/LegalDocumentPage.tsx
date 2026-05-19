import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type LegalSection = {
  title: string
  body?: string
  items?: string[]
}

export function LegalDocumentPage({
  namespace,
  lastUpdated,
}: {
  namespace: 'cookie' | 'subprocessors'
  lastUpdated: string
}) {
  const t = useTranslations(namespace)
  const sections = t.raw('sections') as LegalSection[]

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
            {t('lastUpdated')} {lastUpdated}
          </p>
        </div>

        <div className="mb-12 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6">
          <p className="text-slate-300 leading-relaxed">{t('summary')}</p>
        </div>

        {sections.map((section, index) => (
          <section key={`${section.title}-${index}`} className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">{section.title}</h2>
            <div className="space-y-4 text-slate-400 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:my-3">
              {section.body ? <p>{section.body}</p> : null}
              {section.items ? (
                <ul>
                  {section.items.map((item, itemIndex) => (
                    <li key={`${section.title}-${itemIndex}`}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}

        <div className="mt-16 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            {t('backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
