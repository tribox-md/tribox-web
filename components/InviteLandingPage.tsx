'use client'

import { useEffect, useRef, useState } from 'react'
import type { ShareLinkPreview } from '@/lib/api'
import { track } from '@/lib/analytics'

interface Props {
  token: string
  preview: ShareLinkPreview
}

export function InviteLandingPage({ token, preview }: Props) {
  const [appOpenState, setAppOpenState] = useState<'idle' | 'trying' | 'not_installed'>('idle')
  const [showToast, setShowToast] = useState(false)
  const hiddenAtRef = useRef<number | null>(null)
  const appScheme = process.env.NEXT_PUBLIC_APP_SCHEME ?? 'tribox'

  // 页面加载时埋点
  useEffect(() => {
    track({ event: 'landing_page_view', tokenValid: true, token })
  }, [token])

  // 监听页面可见性变化，判断是否安装了 App
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        hiddenAtRef.current = Date.now()
      } else if (hiddenAtRef.current !== null && appOpenState === 'trying') {
        // 页面又可见了 → App 未安装（或用户切换回来）
        const elapsed = Date.now() - hiddenAtRef.current
        if (elapsed < 2500) {
          setAppOpenState('not_installed')
          setShowToast(true)
          setTimeout(() => setShowToast(false), 4000)
        }
        hiddenAtRef.current = null
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [appOpenState])

  function handleOpenInApp() {
    track({ event: 'cta_click', cta: 'open_app', token })
    setAppOpenState('trying')
    hiddenAtRef.current = null

    // 跳转 custom scheme
    window.location.href = `${appScheme}://join/${token}`

    // 2000ms 后检查是否未安装（页面仍然 focused）
    setTimeout(() => {
      if (appOpenState === 'trying' && document.visibilityState === 'visible') {
        setAppOpenState('not_installed')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 4000)
      }
    }, 2000)
  }

  function handleDownload() {
    track({ event: 'cta_click', cta: 'download', token })
  }

  const roleLabel = preview.role === 'editor' ? '可编辑副本' : '只读副本'

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      {/* Toast 提示 */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-slate-800 border border-white/10 px-5 py-3 shadow-2xl text-sm text-white animate-in fade-in slide-in-from-top-2">
          <span>⚠️</span>
          <span>未检测到 tribox，请先下载安装</span>
        </div>
      )}

      <div className="w-full max-w-lg">
        {/* 邀请卡片 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          {/* 邀请人头像 */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 text-2xl">
            {preview.inviterAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.inviterAvatarUrl}
                alt={preview.inviterName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span>{preview.inviterName.charAt(0).toUpperCase()}</span>
            )}
          </div>

          {/* Hero 标题 */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
            {preview.inviterName} 向你分享了
            <br />
            <span className="text-indigo-400">「{preview.spaceDisplayName}」</span>
          </h1>

          {/* 副标题 */}
          <p className="mt-3 text-slate-400 text-sm">
            最后更新 {preview.lastActiveRelative}
            {' · '}
            <span className="text-indigo-300">{roleLabel}</span>
          </p>

          {/* 提示：这是快照，不是实时协作 */}
          <p className="mt-2 text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            接受后你将获得独立的本地副本，可自由修改和管理。
          </p>

          {/* 过期时间提示 */}
          {preview.expiresAt && (
            <p className="mt-2 text-xs text-yellow-400/70">
              邀请链接将于 {new Date(preview.expiresAt).toLocaleDateString('zh-CN')} 过期
            </p>
          )}

          {/* CTA 按钮组 */}
          <div className="mt-8 flex flex-col gap-3">
            <a
              href="/download"
              onClick={handleDownload}
              className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-base font-semibold text-white transition-colors shadow-lg shadow-indigo-500/20"
            >
              下载 tribox（免费开始）
            </a>

            <button
              type="button"
              onClick={handleOpenInApp}
              className="w-full rounded-xl border border-white/20 hover:border-white/40 px-6 py-3 text-base font-semibold text-slate-300 hover:text-white transition-colors"
            >
              在 tribox 中打开
            </button>
          </div>

          {/* 产品特性 3 点 */}
          <ul className="mt-8 flex flex-col gap-2 text-left text-sm text-slate-400">
            {[
              '📁 本地优先 — Markdown 文件存储，数据永远属于你',
              '🔗 双向链接 — 自动构建知识图谱，思维不再孤立',
              '🔍 全文搜索 — Tantivy + 语义检索，毫秒级响应',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 跳转下载页 */}
        <p className="mt-6 text-center text-xs text-slate-500">
          没装 tribox？<a href="/download" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">前往下载页</a>
        </p>
      </div>
    </div>
  )
}

export function InvalidInvitePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-3xl">
          ⚠️
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">邀请链接已失效</h1>
        <p className="text-slate-400 mb-8">
          该链接可能已过期、被撤销，或者你没有访问权限。
          <br />
          请联系邀请人重新生成链接。
        </p>
        <a
          href="/"
          className="inline-block rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-sm font-semibold text-white transition-colors"
        >
          返回首页
        </a>
      </div>
    </div>
  )
}
