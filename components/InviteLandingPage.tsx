'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { ShareLinkPreview } from '@/lib/api'
import { track } from '@/lib/analytics'

interface Props {
  token: string
  preview: ShareLinkPreview
}

export function InviteLandingPage({ token, preview }: Props) {
  const t = useTranslations('invite')
  const locale = useLocale()
  const [appOpenState, setAppOpenState] = useState<'idle' | 'trying' | 'not_installed'>('idle')
  const [showToast, setShowToast] = useState(false)
  const hiddenAtRef = useRef<number | null>(null)
  const appScheme = process.env.NEXT_PUBLIC_APP_SCHEME ?? 'tribox'

  useEffect(() => {
    track({ event: 'landing_page_view', tokenValid: true, token })
  }, [token])

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        hiddenAtRef.current = Date.now()
      } else if (hiddenAtRef.current !== null && appOpenState === 'trying') {
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
    window.location.href = `${appScheme}://join/${token}`
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

  const roleLabel = preview.role === 'editor' ? t('roleEditor') : t('roleViewer')
  const dateLocale = locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US'

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-slate-800 border border-white/10 px-5 py-3 shadow-2xl text-sm text-white animate-in fade-in slide-in-from-top-2">
          <span>⚠️</span>
          <span>{t('toastNotInstalled')}</span>
        </div>
      )}

      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
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

          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
            {t('inviterShared', { name: preview.inviterName })}
            <br />
            <span className="text-indigo-400">「{preview.spaceDisplayName}」</span>
          </h1>

          <p className="mt-3 text-slate-400 text-sm">
            {t('lastUpdated', { time: preview.lastActiveRelative })}
            {' · '}
            <span className="text-indigo-300">{roleLabel}</span>
          </p>

          <p className="mt-2 text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {t('snapshotNote')}
          </p>

          {preview.expiresAt && (
            <p className="mt-2 text-xs text-yellow-400/70">
              {t('expiresAt', { date: new Date(preview.expiresAt).toLocaleDateString(dateLocale) })}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/download"
              onClick={handleDownload}
              className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-base font-semibold text-white transition-colors shadow-lg shadow-indigo-500/20"
            >
              {t('downloadCta')}
            </Link>

            <button
              type="button"
              onClick={handleOpenInApp}
              className="w-full rounded-xl border border-white/20 hover:border-white/40 px-6 py-3 text-base font-semibold text-slate-300 hover:text-white transition-colors"
            >
              {t('openInApp')}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link
            href="/download"
            className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
          >
            {t('needAppCta')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export function InvalidInvitePage() {
  const t = useTranslations('invite')
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-3xl">
          ⚠️
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">{t('invalidTitle')}</h1>
        <p className="text-slate-400 mb-8">{t('invalidBody')}</p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-sm font-semibold text-white transition-colors"
        >
          {t('backHome')}
        </Link>
      </div>
    </div>
  )
}
