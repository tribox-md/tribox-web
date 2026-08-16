// tribox-web does not own password or account UI. Login, signup and account
// routes redirect to ACCOUNT_ORIGIN. This module retains only the token/session
// compatibility surface consumed by legacy billing/account helpers.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  deviceId: string
  email?: string
  plan?: string
  emailVerified?: boolean
  remoteVaults?: RemoteVaultSummary[]
}

export interface RemoteVaultSummary {
  id: string
  name: string
  encryptionMode: 'standard_managed' | 'private_e2ee' | string
}

/** 刷新 access token（refresh token 同时轮换） */
export async function refresh(refreshToken: string): Promise<Omit<AuthTokens, 'deviceId'>> {
  const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
    method: 'POST',
    signal: AbortSignal.timeout(8000),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) {
    throw {
      status: res.status,
      code: 'invalid_credentials',
      message: '会话已过期，请重新登录',
    }
  }
  return (await res.json()) as { accessToken: string; refreshToken: string }
}

/** 本地 token 存储 — 使用 localStorage（next phase 可迁到 httpOnly cookie 减少 XSS 面积） */
const TOKEN_KEY = 'tribox.auth.tokens.v1'

export function saveTokens(tokens: AuthTokens): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
}

export function loadTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(TOKEN_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthTokens
  } catch {
    return null
  }
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn(): boolean {
  return loadTokens() !== null
}
