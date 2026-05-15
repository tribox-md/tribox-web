'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { login, saveTokens, type AuthErrorPayload } from '@/lib/auth'
import { track } from '@/lib/analytics'

interface Props {
  redirectTo: string
  cameFrom?: string
}

type FormState = 'idle' | 'submitting' | 'deriving' | 'error'

export function LoginForm({ redirectTo, cameFrom }: Props) {
  const t = useTranslations('login')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError(t('fillBoth'))
      return
    }
    setState('deriving')
    setError(null)
    try {
      const tokens = await login(email, password, navigator.userAgent.slice(0, 80))
      saveTokens(tokens)
      track({ event: 'cta_click', cta: 'pricing' })
      router.push(redirectTo)
    } catch (e) {
      const err = e as AuthErrorPayload
      let msg = t('errorDefault')
      if (err?.code === 'invalid_credentials') msg = t('errorInvalidCreds')
      else if (err?.code === 'rate_limited') msg = t('errorRateLimit')
      else if (err?.message) msg = err.message
      setError(msg)
      setState('error')
    }
  }

  const submitting = state === 'submitting' || state === 'deriving'

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{t('title')}</h1>
          <p className="text-slate-400 text-sm">{t('subtitle')}</p>
        </div>

        {cameFrom === 'pricing' && (
          <div className="mb-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-sm text-indigo-200">
            {t('fromPricing')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            label={t('emailLabel')}
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
            disabled={submitting}
          />
          <Field
            label={t('passwordLabel')}
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
            disabled={submitting}
          />

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/20"
          >
            {state === 'deriving' && t('deriving')}
            {state === 'submitting' && t('submitting')}
            {(state === 'idle' || state === 'error') && t('submit')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            {t('noAccount')}
            <Link
              href="/signup"
              className="ml-1 text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              {t('signupLink')}
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-600">
        {t('termsConsent')}
        <Link
          href="/terms"
          className="text-slate-500 hover:text-slate-300 mx-1 underline underline-offset-2"
        >
          {t('termsLink')}
        </Link>
        {t('privacyAnd')}
        <Link
          href="/privacy"
          className="text-slate-500 hover:text-slate-300 mx-1 underline underline-offset-2"
        >
          {t('privacyLink')}
        </Link>
        。
      </p>
    </div>
  )
}

interface FieldProps {
  label: string
  type: 'email' | 'password' | 'text'
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  required?: boolean
  disabled?: boolean
}

function Field({ label, type, value, onChange, autoComplete, required, disabled }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition-colors"
      />
    </label>
  )
}
