// 用户中心 API 对接
//
// 所有调用走 `authedFetch`，自动带 Authorization header；
// 401 时尝试 refresh token，仍失败则清 token 并抛错（调用方应跳转 /login）。

import { loadTokens, saveTokens, clearTokens, refresh, type AuthTokens } from './auth'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

export interface BlobQuota {
  quotaBytes: number
  usedBytes: number
  ratio: number
}

export interface PlanLimits {
  maxSpaces: number
  maxMembersPerSpace: number
  walRetentionDays: number
}

export interface UserPlan {
  planTier: 'free' | 'pro' | 'team' | 'enterprise' | string
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | string
  currentPeriodEnd: string | null
  trialEndsAt: string | null
  seatCount: number
  blobQuota: BlobQuota
  limits: PlanLimits
}

export interface DeviceInfo {
  id: string
  name: string
  platform: string
  lastSeen: string
  createdAt: string
  current: boolean
}

/** 带认证的 fetch，自动 refresh token + 处理 401 */
async function authedFetch(
  path: string,
  init: RequestInit = {},
  retried = false,
): Promise<Response> {
  let tokens = loadTokens()
  if (!tokens) throw new Error('未登录')

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    signal: init.signal ?? AbortSignal.timeout(10000),
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
        ...tokens,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
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

export async function getUserPlan(): Promise<UserPlan> {
  const res = await authedFetch('/api/v1/user/plan')
  if (!res.ok) throw new Error(`获取订阅信息失败 (${res.status})`)
  return (await res.json()) as UserPlan
}

export async function listDevices(): Promise<DeviceInfo[]> {
  const res = await authedFetch('/api/v1/devices')
  if (!res.ok) throw new Error(`获取设备列表失败 (${res.status})`)
  const data = (await res.json()) as { devices: DeviceInfo[] }
  return data.devices
}

/** 注意：后端 logout 会撤销该用户所有 refresh token（全设备登出，不只当前设备） */
export async function logoutAllDevices(): Promise<void> {
  const tokens = loadTokens()
  if (!tokens) return
  try {
    await fetch(`${API_BASE}/api/v1/auth/logout`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    })
  } catch {
    // 网络失败也要清本地 token，本地登出语义优先
  }
  clearTokens()
}

/** 仅清本地 token（不撤销 server 端 refresh token），下次登录无需重做 Argon2 */
export function logoutLocalOnly(): void {
  clearTokens()
}
