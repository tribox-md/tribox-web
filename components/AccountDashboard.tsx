'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { loadTokens } from '@/lib/auth'
import {
  getUserPlan,
  listDevices,
  logoutAllDevices,
  logoutLocalOnly,
  type UserPlan,
  type DeviceInfo,
} from '@/lib/account'

interface Props {
  justSubscribed: boolean
}

type LoadState = 'checking_auth' | 'loading' | 'ready' | 'error'

export function AccountDashboard({ justSubscribed }: Props) {
  const t = useTranslations('account')
  const locale = useLocale()
  const router = useRouter()
  const [state, setState] = useState<LoadState>('checking_auth')
  const [plan, setPlan] = useState<UserPlan | null>(null)
  const [devices, setDevices] = useState<DeviceInfo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [logoutBusy, setLogoutBusy] = useState(false)

  useEffect(() => {
    const tokens = loadTokens()
    if (!tokens) {
      router.replace('/login?redirect=/account')
      return
    }
    setState('loading')
    Promise.all([getUserPlan(), listDevices()])
      .then(([p, d]) => {
        setPlan(p)
        setDevices(d)
        setState('ready')
      })
      .catch((e: Error) => {
        if (e.message === '会话已过期，请重新登录' || e.message === '未登录') {
          router.replace('/login?redirect=/account')
          return
        }
        setError(e.message)
        setState('error')
      })
  }, [router])

  async function handleLogoutAll() {
    if (!confirm(t('logoutAllConfirm'))) return
    setLogoutBusy(true)
    await logoutAllDevices()
    router.replace('/login')
  }

  function handleLogoutLocal() {
    logoutLocalOnly()
    router.replace('/login')
  }

  if (state === 'checking_auth' || state === 'loading') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="px-4 py-24 max-w-2xl mx-auto text-center">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
          <h1 className="text-xl font-semibold text-red-300 mb-3">{t('loadError')}</h1>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            type="button"
            onClick={() => location.reload()}
            className="rounded-xl bg-indigo-500 hover:bg-indigo-400 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    )
  }

  if (!plan) return null

  const planLabel =
    (t.raw('planLabels') as Record<string, string>)[plan.planTier] ?? plan.planTier

  const statusKeyMap: Record<string, { key: string; tone: 'good' | 'warn' | 'bad' }> = {
    active: { key: 'statusActive', tone: 'good' },
    trialing: { key: 'statusTrialing', tone: 'good' },
    past_due: { key: 'statusPastDue', tone: 'warn' },
    canceled: { key: 'statusCanceled', tone: 'bad' },
  }
  const statusInfo = statusKeyMap[plan.status] ?? { key: 'statusActive', tone: 'good' as const }
  const isFree = plan.planTier === 'free'

  const dateLocale = locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US'

  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        {justSubscribed && (
          <div className="mb-8 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-center">
            <p className="text-green-300 font-semibold mb-1">{t('subscribedToast')}</p>
            <p className="text-slate-400 text-sm">{t('subscribedNote')}</p>
          </div>
        )}

        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-3">
            {t('eyebrow')}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t('title')}</h1>
        </div>

        {/* 订阅卡片 */}
        <section className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">{t('subscriptionTitle')}</h2>
              <p className="text-sm text-slate-500">
                {isFree ? t('subscriptionFree') : t('subscriptionPaid')}
              </p>
            </div>
            <StatusBadge text={t(statusInfo.key)} tone={statusInfo.tone} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <Stat label={t('statCurrentPlan')} value={planLabel} />
            <Stat
              label={t('statRenewalDate')}
              value={
                plan.currentPeriodEnd
                  ? new Date(plan.currentPeriodEnd).toLocaleDateString(dateLocale)
                  : '—'
              }
            />
            <Stat
              label={t('statStorage')}
              value={`${formatBytes(plan.blobQuota.usedBytes)} / ${formatBytes(
                plan.blobQuota.quotaBytes,
              )}`}
              progress={plan.blobQuota.ratio}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {isFree ? (
              <Link
                href="/pricing"
                className="rounded-xl bg-indigo-500 hover:bg-indigo-400 px-5 py-2.5 text-sm font-semibold text-white text-center transition-colors"
              >
                {t('upgradeButton')}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title={t('manageTooltip')}
                className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed"
              >
                {t('manageButton')}
              </button>
            )}
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 hover:border-white/40 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white text-center transition-colors"
            >
              {t('viewAllPlans')}
            </Link>
          </div>
        </section>

        {/* 设备列表 */}
        <section className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-1">{t('devicesTitle')}</h2>
          <p className="text-sm text-slate-500 mb-5">
            {t('devicesSubtitle', { count: devices.length })}
          </p>

          <div className="space-y-2">
            {devices.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{platformEmoji(d.platform, t)}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-200">
                      {d.name}
                      {d.current && (
                        <span className="ml-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-xs text-indigo-300">
                          {t('deviceCurrent')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {d.platform} · {t('deviceLastSeen')} {formatRelativeTime(d.lastSeen, t)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-slate-500">{t('deviceNote')}</p>
        </section>

        {/* 危险操作 */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-1">{t('logoutTitle')}</h2>
          <p className="text-sm text-slate-500 mb-5">{t('logoutSubtitle')}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleLogoutLocal}
              className="rounded-xl border border-white/20 hover:border-white/40 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              {t('logoutLocal')}
            </button>
            <button
              type="button"
              onClick={handleLogoutAll}
              disabled={logoutBusy}
              className="rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 px-5 py-2.5 text-sm font-semibold text-red-300 transition-colors"
            >
              {logoutBusy ? t('logoutWorking') : t('logoutAll')}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function StatusBadge({ text, tone }: { text: string; tone: 'good' | 'warn' | 'bad' }) {
  const styles = {
    good: 'border-green-500/30 bg-green-500/10 text-green-300',
    warn: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    bad: 'border-red-500/30 bg-red-500/10 text-red-300',
  }[tone]
  return <span className={`text-xs px-2.5 py-1 rounded-full border ${styles}`}>{text}</span>
}

function Stat({
  label,
  value,
  progress,
}: {
  label: string
  value: string
  progress?: number
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="text-xs text-slate-500 mb-1.5">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
      {typeof progress === 'number' && (
        <div className="mt-2 h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-indigo-500"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
      )}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function platformEmoji(platform: string, t: any): string {
  const p = platform.toLowerCase()
  const labels = t.raw('platformLabels') as Record<string, string>
  if (p.includes('mac') || p.includes('darwin')) return labels.mac
  if (p.includes('win')) return labels.windows
  if (p.includes('linux')) return labels.linux
  if (p.includes('ios')) return labels.ios
  if (p.includes('android')) return labels.android
  if (p.includes('web') || p.includes('mozilla') || p.includes('chrome')) return labels.web
  return labels.default
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatRelativeTime(iso: string, t: any): string {
  const ms = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(ms / 1000)
  if (sec < 60) return t('timeAgo.justNow')
  if (sec < 3600) return t('timeAgo.minutes', { n: Math.floor(sec / 60) })
  if (sec < 86400) return t('timeAgo.hours', { n: Math.floor(sec / 3600) })
  return t('timeAgo.days', { n: Math.floor(sec / 86400) })
}
