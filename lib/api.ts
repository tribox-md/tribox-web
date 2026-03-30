const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

export interface ShareLinkPreview {
  valid: boolean
  spaceDisplayName: string
  inviterName: string
  inviterAvatarUrl: string | null
  memberCount: number
  lastActiveRelative: string
  role: 'editor' | 'viewer'
  expiresAt: string | null
}

/**
 * 落地页预览（无需认证）
 * GET /api/v1/share-links/{token}/preview
 */
export async function getShareLinkPreview(token: string): Promise<ShareLinkPreview | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/share-links/${encodeURIComponent(token)}/preview`, {
      signal: AbortSignal.timeout(5000),
      // Next.js 14 默认 fetch 缓存策略
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return (await res.json()) as ShareLinkPreview
  } catch {
    return null
  }
}

export interface AcceptInviteResult {
  success: boolean
  spaceDisplayName: string
  errorMessage?: string
}

/**
 * 接受邀请（需要 session token，仅客户端使用）
 * POST /api/v1/share-links/{token}/accept
 */
export async function acceptInvite(
  token: string,
  sessionToken: string,
): Promise<AcceptInviteResult> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/share-links/${encodeURIComponent(token)}/accept`, {
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ token }),
    })
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string }
      return {
        success: false,
        spaceDisplayName: '',
        errorMessage: body.message ?? `请求失败 (${res.status})`,
      }
    }
    const data = (await res.json()) as { spaceDisplayName: string }
    return { success: true, spaceDisplayName: data.spaceDisplayName }
  } catch (err) {
    return {
      success: false,
      spaceDisplayName: '',
      errorMessage: err instanceof Error ? err.message : '网络错误',
    }
  }
}
