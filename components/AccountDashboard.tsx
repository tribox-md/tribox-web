'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

const PLAN_LABEL: Record<string, string> = {
  free: '免费 · 基础 app',
  pro: 'tribox Sync',
  team: 'Commercial',
  enterprise: 'Enterprise',
}

const STATUS_LABEL: Record<string, { text: string; tone: 'good' | 'warn' | 'bad' }> = {
  active: { text: '正常', tone: 'good' },
  trialing: { text: '试用中', tone: 'good' },
  past_due: { text: '付款失败', tone: 'warn' },
  canceled: { text: '已取消', tone: 'bad' },
}

export function AccountDashboard({ justSubscribed }: Props) {
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
    if (!confirm('确定要退出所有设备吗？所有设备（含桌面客户端）都会被强制重新登录。')) return
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
          <h1 className="text-xl font-semibold text-red-300 mb-3">加载失败</h1>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            type="button"
            onClick={() => location.reload()}
            className="rounded-xl bg-indigo-500 hover:bg-indigo-400 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  if (!plan) return null

  const planLabel = PLAN_LABEL[plan.planTier] ?? plan.planTier
  const statusInfo = STATUS_LABEL[plan.status] ?? { text: plan.status, tone: 'good' as const }
  const isFree = plan.planTier === 'free'

  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        {justSubscribed && (
          <div className="mb-8 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-center">
            <p className="text-green-300 font-semibold mb-1">🎉 订阅成功！</p>
            <p className="text-slate-400 text-sm">在你的桌面 tribox 客户端登录同一账号即可开始同步。</p>
          </div>
        )}

        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-3">
            账号
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            你的 tribox 账号
          </h1>
        </div>

        {/* 订阅卡片 */}
        <section className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">订阅</h2>
              <p className="text-sm text-slate-500">{plan.planTier === 'free' ? '基础免费档' : '付费订阅'}</p>
            </div>
            <StatusBadge {...statusInfo} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <Stat label="当前计划" value={planLabel} />
            <Stat
              label="续费日期"
              value={
                plan.currentPeriodEnd
                  ? new Date(plan.currentPeriodEnd).toLocaleDateString('zh-CN')
                  : '—'
              }
            />
            <Stat
              label="附件存储"
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
                升级到 Sync
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title="Stripe Customer Portal 接入中"
                className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed"
              >
                管理订阅（即将开放）
              </button>
            )}
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 hover:border-white/40 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white text-center transition-colors"
            >
              查看所有计划
            </Link>
          </div>
        </section>

        {/* 设备列表 */}
        <section className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-1">已登录设备</h2>
          <p className="text-sm text-slate-500 mb-5">
            {devices.length} 台设备 · 单个用户最多 20 台
          </p>

          <div className="space-y-2">
            {devices.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{platformIcon(d.platform)}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-200">
                      {d.name}
                      {d.current && (
                        <span className="ml-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-xs text-indigo-300">
                          当前
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {d.platform} · 最后活跃 {formatRelativeTime(d.lastSeen)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            单设备移除需要在桌面客户端的设置 → 账号 → 设备中操作。
          </p>
        </section>

        {/* 危险操作 */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-1">登出</h2>
          <p className="text-sm text-slate-500 mb-5">
            "仅退出当前浏览器"不影响桌面客户端；"退出所有设备"会强制全部设备重新登录。
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleLogoutLocal}
              className="rounded-xl border border-white/20 hover:border-white/40 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              仅退出当前浏览器
            </button>
            <button
              type="button"
              onClick={handleLogoutAll}
              disabled={logoutBusy}
              className="rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 px-5 py-2.5 text-sm font-semibold text-red-300 transition-colors"
            >
              {logoutBusy ? '处理中…' : '退出所有设备'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

// ============ 子组件 ============

function StatusBadge({ text, tone }: { text: string; tone: 'good' | 'warn' | 'bad' }) {
  const styles = {
    good: 'border-green-500/30 bg-green-500/10 text-green-300',
    warn: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    bad: 'border-red-500/30 bg-red-500/10 text-red-300',
  }[tone]
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${styles}`}>{text}</span>
  )
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

function platformIcon(platform: string): string {
  const p = platform.toLowerCase()
  if (p.includes('mac') || p.includes('darwin')) return '🍎'
  if (p.includes('win')) return '🪟'
  if (p.includes('linux')) return '🐧'
  if (p.includes('ios')) return '📱'
  if (p.includes('android')) return '🤖'
  if (p.includes('web') || p.includes('mozilla') || p.includes('chrome')) return '🌐'
  return '💻'
}

function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(ms / 1000)
  if (sec < 60) return '刚刚'
  if (sec < 3600) return `${Math.floor(sec / 60)} 分钟前`
  if (sec < 86400) return `${Math.floor(sec / 3600)} 小时前`
  return `${Math.floor(sec / 86400)} 天前`
}
