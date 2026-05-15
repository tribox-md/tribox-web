import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { AppleIcon, WindowsIcon, MobileIcon } from '@/components/PlatformIcon'

interface Props {
  params: Promise<{ locale: string }>
}

const PRINCIPLE_KEYS = [1, 2, 3, 4, 5] as const
const CAPABILITY_KEYS = [1, 2, 3, 4, 5, 6] as const

const PLATFORMS = [
  { key: 'macos', label: 'macOS', Icon: AppleIcon },
  { key: 'windows', label: 'Windows', Icon: WindowsIcon },
  { key: 'mobile', label: 'iOS / Android', Icon: MobileIcon },
] as const

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HomeContent />
}

function HomeContent() {
  const t = useTranslations('home')

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-28 sm:py-40 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[500px] w-[800px] rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            {t('badge')}
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-[1.05] tracking-tight">
            {t('heroTitle1')}
            <br />
            {t('heroTitle2')}
            <br />
            <span className="text-indigo-400">{t('heroTitle3')}</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
            {t('heroSubtitle1')}
            <br />
            <span className="text-slate-500">{t('heroSubtitle2')}</span>
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/download"
              className="w-full sm:w-auto rounded-xl bg-indigo-500 hover:bg-indigo-400 px-8 py-3.5 text-base font-semibold text-white transition-colors shadow-lg shadow-indigo-500/20"
            >
              {t('heroCtaPrimary')}
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto rounded-xl border border-white/20 hover:border-white/40 px-8 py-3.5 text-base font-semibold text-slate-300 hover:text-white transition-colors"
            >
              {t('heroCtaSecondary')}
            </Link>
          </div>

          <p className="mt-5 text-sm text-slate-600">{t('platformNote')}</p>
        </div>
      </section>

      {/* 五原则 */}
      <section className="px-4 py-24 sm:py-32 border-t border-white/10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            {t('principlesTitle')}
          </h2>
          <p className="text-center text-slate-400 mb-16 max-w-xl mx-auto">
            {t('principlesIntro')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {PRINCIPLE_KEYS.map((idx) => (
              <div key={idx} className="flex gap-5">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-sm font-semibold">
                  {idx}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg mb-2">
                    {t(`principle${idx}Title`)}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {t(`principle${idx}Body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-4 py-24 sm:py-32 border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
            {CAPABILITY_KEYS.map((idx) => (
              <div key={idx}>
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-3">
                  {t(`capability${idx}Eyebrow`)}
                </p>
                <h3 className="text-2xl font-semibold text-white mb-4 leading-tight tracking-tight">
                  {t(`capability${idx}Title`)}
                </h3>
                <p className="text-slate-400 leading-relaxed">{t(`capability${idx}Body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 下载 */}
      <section id="download-section" className="px-4 py-24 sm:py-32 border-t border-white/10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            {t('downloadTitle')}
          </h2>
          <p className="text-slate-400 mb-12">{t('downloadSubtitle')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLATFORMS.map(({ key, label, Icon }) => (
              <Link
                key={key}
                href="/download"
                className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 hover:border-indigo-500/40 p-6 transition-colors group"
              >
                <Icon size={36} className="text-slate-200 group-hover:text-white transition-colors" />
                <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {label}
                </span>
                <span className="text-xs text-slate-500">{t(`platforms.${key}`)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
