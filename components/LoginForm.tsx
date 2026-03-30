'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login, saveTokens, type AuthErrorPayload } from '@/lib/auth'
import { track } from '@/lib/analytics'

interface Props {
  redirectTo: string
  cameFrom?: string
}

type FormState = 'idle' | 'submitting' | 'deriving' | 'error'

export function LoginForm({ redirectTo, cameFrom }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError('请填写邮箱和密码')
      return
    }
    setState('deriving')
    setError(null)
    try {
      // 客户端 Argon2id 计算可能耗时 0.5-2s，UI 上提示
      const tokens = await login(email, password, navigator.userAgent.slice(0, 80))
      saveTokens(tokens)
      track({ event: 'cta_click', cta: 'pricing' }) // 暂复用现有事件，后续 analytics.ts 扩展 login_success
      router.push(redirectTo)
    } catch (e) {
      const err = e as AuthErrorPayload
      setError(err?.message ?? '登录失败，请重试')
      setState('error')
    }
  }

  const submitting = state === 'submitting' || state === 'deriving'

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">登录 tribox</h1>
          <p className="text-slate-400 text-sm">
            使用桌面客户端注册的账号
          </p>
        </div>

        {cameFrom === 'pricing' && (
          <div className="mb-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-sm text-indigo-200">
            登录后即可订阅 tribox Sync
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            label="邮箱"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
            disabled={submitting}
          />
          <Field
            label="密码"
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
            {state === 'deriving' && '正在派生密钥…'}
            {state === 'submitting' && '登录中…'}
            {(state === 'idle' || state === 'error') && '登录'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            还没有 tribox 账号？
            <Link
              href="/signup"
              className="ml-1 text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              注册指引
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-600">
        登录即视为同意 tribox 的
        <Link href="/terms" className="text-slate-500 hover:text-slate-300 mx-1 underline underline-offset-2">
          服务条款
        </Link>
        与
        <Link href="/privacy" className="text-slate-500 hover:text-slate-300 mx-1 underline underline-offset-2">
          隐私政策
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
