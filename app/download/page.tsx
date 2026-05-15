import type { Metadata } from 'next'
import Link from 'next/link'
import { resolveDownloads } from '@/lib/downloads'

export const metadata: Metadata = {
  title: '下载 tribox',
  description: 'tribox 桌面客户端下载 — macOS、Windows、Linux。永久免费，无需注册。',
}

export default function DownloadPage() {
  const { version, downloads, ready } = resolveDownloads()

  return (
    <div className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        {/* 标题 */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-4">
            下载
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            把 tribox 装到你的电脑上。
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            桌面优先的本地笔记应用，{version ? `当前版本 ${version}` : '即将推出第一个公开版本'}
            。安装即用，无需注册。
          </p>
        </div>

        {/* 未发布提示 */}
        {!ready && (
          <div className="mb-12 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 text-center">
            <p className="text-yellow-400 text-sm font-medium mb-2">🚧 公开版本尚未发布</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              tribox 正在准备首个公开发布，预计 2026 年内推出。
              <br />
              想第一时间收到通知？发邮件到{' '}
              <a
                href="mailto:hello@tribox.md?subject=Notify%20me%20when%20tribox%20launches"
                className="text-indigo-300 hover:text-indigo-200"
              >
                hello@tribox.md
              </a>{' '}
              并写下"发布通知"。
            </p>
          </div>
        )}

        {/* 下载列表 */}
        <div className="space-y-6 mb-16">
          {/* macOS */}
          <PlatformGroup
            title="macOS"
            icon="🍎"
            note="macOS 11 Big Sur 及以上"
            downloads={downloads.filter((d) => d.asset.os === 'macOS')}
            ready={ready}
          />

          {/* Windows */}
          <PlatformGroup
            title="Windows"
            icon="🪟"
            note="Windows 10 / 11，x64"
            downloads={downloads.filter((d) => d.asset.os === 'Windows')}
            ready={ready}
          />

          {/* Linux */}
          <PlatformGroup
            title="Linux"
            icon="🐧"
            note="开发中，预计随 v1.1 发布"
            downloads={downloads.filter((d) => d.asset.os === 'Linux')}
            ready={false}
          />
        </div>

        {/* 移动端说明 */}
        <div className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium mb-2">
            移动端
          </p>
          <h3 className="text-lg font-semibold text-white mb-2">iOS / Android 客户端</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            tribox 移动端正在开发中（Tauri Mobile），将作为桌面版的延伸——
            通过 Sync 在手机上记下灵感，回到桌面继续展开。预计 2026 年下半年公开测试。
          </p>
        </div>

        {/* 安全提示 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-sm font-semibold text-white mb-3">⚠️ 关于安全警告</h3>
          <ul className="space-y-2 text-sm text-slate-400 leading-relaxed">
            <li>
              <strong className="text-slate-300">macOS</strong>：首次打开未签名版本会被
              Gatekeeper 拦截。右键 → "打开"，或在系统设置 → 隐私与安全性中允许。
            </li>
            <li>
              <strong className="text-slate-300">Windows</strong>：未签名版本会触发 SmartScreen
              警告。点击"更多信息" → "仍要运行"。
            </li>
            <li>
              代码签名证书需要数百美元/年的支出，tribox
              暂未购买。所有发布物的 SHA256 校验值随版本一起发布，方便你验证完整性。
            </li>
          </ul>
        </div>

        {/* 返回 */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}

interface PlatformGroupProps {
  title: string
  icon: string
  note: string
  downloads: ReturnType<typeof resolveDownloads>['downloads']
  ready: boolean
}

function PlatformGroup({ title, icon, note, downloads, ready }: PlatformGroupProps) {
  if (downloads.length === 0) return null

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start gap-4 mb-5">
        <span className="text-3xl">{icon}</span>
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

          const content = (
            <>
              <div>
                <div className="text-sm font-medium text-slate-200">{asset.arch}</div>
                <div className="text-xs text-slate-500 mt-0.5">{asset.format}</div>
              </div>
              <span
                className={
                  disabled
                    ? 'text-slate-600 text-xs'
                    : 'text-slate-500 group-hover:text-indigo-400 transition-colors'
                }
              >
                {disabled ? (asset.available ? '即将推出' : '开发中') : '↓'}
              </span>
            </>
          )

          if (disabled) {
            return (
              <div key={asset.arch} className={`${baseClass} ${disabledClass}`}>
                {content}
              </div>
            )
          }

          return (
            <a
              key={asset.arch}
              href={url}
              className={`${baseClass} ${enabledClass}`}
              download
            >
              {content}
            </a>
          )
        })}
      </div>
    </div>
  )
}
