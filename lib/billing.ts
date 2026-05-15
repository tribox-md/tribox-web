// Stripe 计费对接
//
// 后端 POST /api/v1/billing/checkout-session：
//   - 必须 Bearer access_token
//   - body: { planTier?: 'pro' | 'team', priceId?: string }
//   - response: { url, sessionId } — 前端直接 window.location = url 跳转
//
// 后端 POST /api/v1/billing/portal-session：调用 Stripe billing_portal API，
//   返回 { url } 由前端跳转。当后端尚未实现该端点时，前端会收到 404，提示
//   "订阅管理功能开放中"。

import { loadTokens, saveTokens, clearTokens, refresh, type AuthTokens } from './auth'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

export interface CheckoutSessionResponse {
  url: string
  sessionId: string
}

export interface CheckoutOptions {
  planTier?: 'pro' | 'team'
  priceId?: string
}

/** 带认证的 fetch，自动 refresh token 一次 */
async function authedFetch(
  path: string,
  init: RequestInit = {},
  retried = false,
): Promise<Response> {
  let tokens = loadTokens()
  if (!tokens) throw new Error('需要登录')

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    signal: init.signal ?? AbortSignal.timeout(15000),
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${tokens.accessToken}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })

  if (res.status === 401 && !retried) {
    try {
      const refreshed = await refresh(tokens.refreshToken)
      const next: AuthTokens = {
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        deviceId: tokens.deviceId,
      }
      saveTokens(next)
      return authedFetch(path, init, true)
    } catch {
      clearTokens()
      throw new Error('会话已过期，请重新登录')
    }
  }

  return res
}

/** 创建 Stripe Checkout 会话，返回跳转 URL */
export async function createCheckoutSession(
  opts: CheckoutOptions = {},
): Promise<CheckoutSessionResponse> {
  const body: Record<string, string> = {}
  if (opts.planTier) body.planTier = opts.planTier
  if (opts.priceId) body.priceId = opts.priceId

  const res = await authedFetch('/api/v1/billing/checkout-session', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (res.status === 400) {
    const err = (await res.json().catch(() => ({}))) as { code?: string; message?: string }
    if (err.code === 'invalid_price_selection') {
      throw new Error('当前产品价目未配置，请稍后再试或联系 hello@tribox.md')
    }
    throw new Error(err.message ?? '请求参数有误')
  }
  if (!res.ok) {
    throw new Error(`创建支付会话失败 (${res.status})`)
  }

  return (await res.json()) as CheckoutSessionResponse
}

/** 跳转到 Stripe Checkout。未登录则抛错让调用方跳 /login */
export async function startCheckout(opts: CheckoutOptions = {}): Promise<void> {
  const session = await createCheckoutSession(opts)
  if (typeof window !== 'undefined') {
    window.location.href = session.url
  }
}

/** Customer Portal — 后端 portal-session 端点实现后启用 */
export async function openCustomerPortal(): Promise<void> {
  const res = await authedFetch('/api/v1/billing/portal-session', { method: 'POST' })
  if (res.status === 404) {
    throw new Error('订阅管理功能开放中，敬请期待')
  }
  if (!res.ok) {
    throw new Error(`无法打开订阅管理 (${res.status})`)
  }
  const data = (await res.json()) as { url: string }
  if (typeof window !== 'undefined') {
    window.location.href = data.url
  }
}
