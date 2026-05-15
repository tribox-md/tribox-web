import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { AppleIcon, WindowsIcon, MobileIcon, DownloadArrow } from '@/components/PlatformIcon'
import { resolveDownloads, type PlatformOS } from '@/lib/downloads'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'download' })
  return { title: t('title') }
}

export default async function DownloadPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <DownloadContent />
}

function DownloadContent() {
  const t = useTranslations('download')
  const tCommon = useTranslations('download.assetFormats')
  const { version, downloads, ready } = resolveDownloads()

  return (
    <div className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        {/* 标题 */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            {version ? t('subtitleWithVersion', { version }) : t('subtitleNoVersion')}
          </p>
        </div>

        {/* 未发布提示 */}
        {!ready && (
          <div className="mb-12 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 text-center">
            <p className="text-yellow-400 text-sm font-medium mb-2">{t('notReadyTitle')}</p>
            <p
              className="text-slate-400 text-sm leading-relaxed [&_a]:text-indigo-300 [&_a:hover]:text-indigo-200"
              dangerouslySetInnerHTML={{
                __html: `${t('notReadyBody')}<br/>${linkifyEmail(t('notReadyCta'))}`,
              }}
            />
          </div>
        )}

        {/* 下载列表 */}
        <div className="space-y-6 mb-16">
          <PlatformGroup
            os="macOS"
            title={t('macosTitle')}
            note={t('macosNote')}
            icon={<AppleIcon size={28} className="text-slate-200" />}
            downloads={downloads.filter((d) => d.asset.os === 'macOS')}
            ready={ready}
            comingSoon={t('comingSoon')}
            getArchLabel={(key) => tCommon(key)}
          />
          <PlatformGroup
            os="Windows"
            title={t('windowsTitle')}
            note={t('windowsNote')}
            icon={<WindowsIcon size={26} className="text-slate-200" />}
            downloads={downloads.filter((d) => d.asset.os === 'Windows')}
            ready={ready}
            comingSoon={t('comingSoon')}
            getArchLabel={(key) => tCommon(key)}
          />
        </div>

        {/* 移动端说明 */}
        <div className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start gap-4 mb-3">
            <MobileIcon size={26} className="text-slate-300 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium mb-1">
                {t('mobileEyebrow')}
              </p>
              <h3 className="text-lg font-semibold text-white">{t('mobileTitle')}</h3>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{t('mobileBody')}</p>
        </div>

        {/* 安全提示 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-sm font-semibold text-white mb-3">{t('securityTitle')}</h3>
          <ul className="space-y-2 text-sm text-slate-400 leading-relaxed">
            <li dangerouslySetInnerHTML={{ __html: renderMd(t('securityMacos')) }} />
            <li dangerouslySetInnerHTML={{ __html: renderMd(t('securityWindows')) }} />
            <li>{t('securityCert')}</li>
          </ul>
        </div>

        {/* 返回 */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            {t('backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}

interface PlatformGroupProps {
  os: PlatformOS
  title: string
  note: string
  icon: React.ReactNode
  downloads: ReturnType<typeof resolveDownloads>['downloads']
  ready: boolean
  comingSoon: string
  getArchLabel: (key: string) => string
}

function PlatformGroup({
  title,
  note,
  icon,
  downloads,
  ready,
  comingSoon,
  getArchLabel,
}: PlatformGroupProps) {
  if (downloads.length === 0) return null

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start gap-4 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{note}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {downloads.map(({ asset, url }) => {
          const disabled = !url || !ready
          const baseClass =
            'flex items-center justify-between rounded-xl border px-4 py-3 transition-colors'
          const enabledClass =
            'border-white/10 bg-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5 group'
          const disabledClass = 'border-white/5 bg-white/[0.02] cursor-not-allowed opacity-50'
          const archLabel = getArchLabel(asset.archKey)

          const content = (
            <>
              <div>
                <div className="text-sm font-medium text-slate-200">{archLabel}</div>
                <div className="text-xs text-slate-500 mt-0.5">{asset.format}</div>
              </div>
              {disabled ? (
                <span className="text-slate-600 text-xs">{comingSoon}</span>
              ) : (
                <DownloadArrow
                  size={18}
                  className="text-slate-500 group-hover:text-indigo-400 transition-colors"
                />
              )}
            </>
          )

          if (disabled) {
            return (
              <div key={asset.archKey} className={`${baseClass} ${disabledClass}`}>
                {content}
              </div>
            )
          }
          return (
            <a key={asset.archKey} href={url!} className={`${baseClass} ${enabledClass}`} download>
              {content}
            </a>
          )
        })}
      </div>
    </div>
  )
}

// 简易 **bold** Markdown 渲染（仅处理粗体）
function renderMd(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-300">$1</strong>')
}

// 邮箱文字转可点击链接
function linkifyEmail(text: string): string {
  return text.replace(
    /(hello@tribox\.md|privacy@tribox\.md)/g,
    '<a href="mailto:$1?subject=Notify%20me%20when%20tribox%20launches">$1</a>',
  )
}
