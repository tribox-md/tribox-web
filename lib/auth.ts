// tribox-sync-server 鉴权对接
//
// 后端要求客户端先做 Argon2id 计算后，把派生密钥作为 `serverPassword` 发送到 /login。
// 流程：
//   1. GET  /auth/params?email=...  → 拿到该邮箱对应的 salt + KDF 参数（未注册邮箱返回随机 salt，防枚举）
//   2. 客户端 Argon2id(password, salt, kdfParams) → 32 字节 → base64
//   3. POST /auth/login { email, serverPassword: <base64>, deviceName } → 返回 accessToken + refreshToken
//
// Web signup only creates an account. Remote Sync vault creation is a separate
// desktop setup step so managed and client-held key modes stay separate.
//

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

export interface KdfParams {
  algorithm: 'argon2id'
  iterations: number
  memory: number
  parallelism: number
}

export interface AuthParamsResponse {
  salt: string // base64
  kdfParams: string // JSON 字符串，需 JSON.parse 得到 KdfParams
}

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

export interface AuthErrorPayload {
  status: number
  code: 'invalid_credentials' | 'rate_limited' | 'conflict' | 'network' | 'unknown'
  message: string
}

const DEFAULT_SIGNUP_KDF_PARAMS = {
  algorithm: 'argon2id',
  iterations: 3,
  memory: 65536,
  parallelism: 4,
} satisfies KdfParams

const DEFAULT_SIGNUP_KDF_PARAMS_JSON = JSON.stringify(DEFAULT_SIGNUP_KDF_PARAMS)

/** Step 1 — 拿 KDF 参数 */
export async function getAuthParams(email: string): Promise<AuthParamsResponse> {
  const url = `${API_BASE}/api/v1/auth/params?email=${encodeURIComponent(email)}`
  const res = await fetch(url, {
    method: 'GET',
    signal: AbortSignal.timeout(8000),
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw {
      status: res.status,
      code: 'unknown',
      message: `获取认证参数失败 (${res.status})`,
    } satisfies AuthErrorPayload
  }
  return (await res.json()) as AuthParamsResponse
}

/** Step 2 — 客户端 Argon2id 派生 serverPassword（base64） */
export async function deriveServerPassword(
  password: string,
  saltBase64: string,
  kdfParamsJson: string,
): Promise<string> {
  // 用 @noble/hashes 的 Argon2id 异步实现（每 ~30ms 让出主线程避免 UI 冻结）
  const { argon2idAsync } = await import('@noble/hashes/argon2.js')
  const params = JSON.parse(kdfParamsJson) as KdfParams

  if (params.algorithm !== 'argon2id') {
    throw {
      status: 0,
      code: 'unknown',
      message: `不支持的 KDF 算法：${params.algorithm}`,
    } satisfies AuthErrorPayload
  }

  const hash = await argon2idAsync(password, base64ToBytes(saltBase64), {
    t: params.iterations,
    m: params.memory,
    p: params.parallelism,
    dkLen: 32,
    asyncTick: 30,
  })

  return bytesToBase64(hash)
}

/** Step 3 — 提交登录 */
export async function login(
  email: string,
  password: string,
  deviceName: string = 'tribox web',
): Promise<AuthTokens> {
  let params: AuthParamsResponse
  try {
    params = await getAuthParams(email)
  } catch (err) {
    if (err instanceof Error) {
      throw {
        status: 0,
        code: 'network',
        message: err.message,
      } satisfies AuthErrorPayload
    }
    throw err
  }

  const serverPassword = await deriveServerPassword(password, params.salt, params.kdfParams)

  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    signal: AbortSignal.timeout(10000),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, serverPassword, deviceName }),
  })

  if (res.status === 401) {
    throw {
      status: 401,
      code: 'invalid_credentials',
      message: '邮箱或密码错误',
    } satisfies AuthErrorPayload
  }
  if (res.status === 429) {
    throw {
      status: 429,
      code: 'rate_limited',
      message: '请求过于频繁，请稍后再试',
    } satisfies AuthErrorPayload
  }
  if (!res.ok) {
    throw {
      status: res.status,
      code: 'unknown',
      message: `登录失败 (${res.status})`,
    } satisfies AuthErrorPayload
  }

  return (await res.json()) as AuthTokens
}

export async function signup(
  email: string,
  password: string,
  deviceName: string = 'tribox web',
): Promise<AuthTokens> {
  const salt = generateSaltBase64()
  const serverPassword = await deriveServerPassword(password, salt, DEFAULT_SIGNUP_KDF_PARAMS_JSON)

  const res = await fetch(`${API_BASE}/api/v1/auth/signup`, {
    method: 'POST',
    signal: AbortSignal.timeout(10000),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      serverPassword,
      salt,
      kdfParams: DEFAULT_SIGNUP_KDF_PARAMS_JSON,
      deviceName,
    }),
  })

  if (res.status === 409) {
    throw {
      status: 409,
      code: 'conflict',
      message: '该邮箱已经注册',
    } satisfies AuthErrorPayload
  }
  if (res.status === 429) {
    throw {
      status: 429,
      code: 'rate_limited',
      message: '请求过于频繁，请稍后再试',
    } satisfies AuthErrorPayload
  }
  if (!res.ok) {
    throw {
      status: res.status,
      code: 'unknown',
      message: `注册失败 (${res.status})`,
    } satisfies AuthErrorPayload
  }

  return (await res.json()) as AuthTokens
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
    } satisfies AuthErrorPayload
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

// ============ base64 helpers ============

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function generateSaltBase64(): string {
  const salt = new Uint8Array(16)
  crypto.getRandomValues(salt)
  return bytesToBase64(salt)
}
