// G5-4: 增长漏斗指标（客户端埋点，使用 Beacon API）

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'
const ANALYTICS_ENDPOINT = `${API_BASE}/api/analytics`
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
const ANALYTICS_CONSENT_KEY = 'tribox.analyticsConsent'

export type AnalyticsEvent =
  | { event: 'landing_page_view'; tokenValid: boolean; token: string }
  | { event: 'cta_click'; cta: 'download' | 'open_app' | 'pricing'; token?: string }
  | {
      event: 'onboarding_step_complete'
      step: 'use_case' | 'download' | 'space_join'
      inviteToken?: string
    }

/**
 * 发送埋点事件。
 * 优先使用 navigator.sendBeacon（不阻塞页面）；
 * 如果 Beacon API 不可用则降级为 fetch（fire-and-forget）。
 */
export function track(data: AnalyticsEvent): void {
  // 仅在客户端运行
  if (typeof window === 'undefined') return
  if (!ANALYTICS_ENABLED) return
  if (!hasAnalyticsConsent()) return

  const payload = JSON.stringify({
    ...data,
    ts: Date.now(),
    url: window.location.href,
  })
  const blob = new Blob([payload], { type: 'application/json' })

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    navigator.sendBeacon(ANALYTICS_ENDPOINT, blob)
  } else {
    // 降级：fire-and-forget，不 await，不处理错误
    fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // 埋点失败不影响主流程
    })
  }
}

function hasAnalyticsConsent(): boolean {
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === 'granted'
  } catch {
    return false
  }
}
