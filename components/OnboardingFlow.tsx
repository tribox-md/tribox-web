'use client'

import { useState } from 'react'
import { track } from '@/lib/analytics'
import { acceptInvite } from '@/lib/api'

type UseCase = 'knowledge' | 'team' | 'personal' | 'project'
type Step = 1 | 2 | 3 | 4

const USE_CASES: Array<{ id: UseCase; icon: string; label: string; desc: string }> = [
  { id: 'knowledge', icon: '🧠', label: '知识管理', desc: '构建个人知识库，双向链接，思维图谱' },
  { id: 'team', icon: '📤', label: '快照分享', desc: '把笔记打包发给别人，对方拿到独立副本' },
  { id: 'personal', icon: '📝', label: '个人笔记', desc: '日记、灵感记录、学习笔记' },
  { id: 'project', icon: '🚀', label: '项目管理', desc: '任务跟踪，@due 日期，项目文档' },
]

const STEPS = ['选择用途', '下载应用', '接受分享', '完成']

interface Props {
  inviteToken?: string
  sessionToken?: string
}

export function OnboardingFlow({ inviteToken, sessionToken = '' }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null)
  const [joinState, setJoinState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [joinedSpaceName, setJoinedSpaceName] = useState('')
  const [joinError, setJoinError] = useState('')

  function goToStep(s: Step) {
    setStep(s)
  }

  function handleUseCaseSelect(id: UseCase) {
    setSelectedUseCase(id)
  }

  function handleUseCaseConfirm() {
    if (!selectedUseCase) return
    track({ event: 'onboarding_step_complete', step: 'use_case', inviteToken })
    goToStep(2)
  }

  function handleDownloadClick() {
    track({ event: 'cta_click', cta: 'download' })
    track({ event: 'onboarding_step_complete', step: 'download', inviteToken })
    // 如果有邀请 token 则跳 Step 3，否则跳 Step 4
    goToStep(inviteToken ? 3 : 4)
  }

  async function handleJoinSpace() {
    if (!inviteToken) return

    // 无 session token 时提示用户先注册/登录，不发送必定 401 的请求
    if (!sessionToken) {
      setJoinState('error')
      setJoinError('请先完成注册或登录，再接受分享')
      return
    }

    setJoinState('loading')

    const result = await acceptInvite(inviteToken, sessionToken)
    if (result.success) {
      setJoinState('success')
      setJoinedSpaceName(result.spaceDisplayName)
      track({ event: 'onboarding_step_complete', step: 'space_join', inviteToken })
      goToStep(4)
    } else {
      setJoinState('error')
      setJoinError(result.errorMessage ?? '加入失败，请重试')
    }
  }

  function handleOpenInApp() {
    track({ event: 'cta_click', cta: 'open_app', token: inviteToken })
    const appScheme = process.env.NEXT_PUBLIC_APP_SCHEME ?? 'tribox'
    if (inviteToken) {
      window.location.href = `${appScheme}://join/${inviteToken}`
    } else {
      window.location.href = `${appScheme}://`
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{step}/{STEPS.length}</span>
            <span className="text-sm text-indigo-300 font-medium">{STEPS[step - 1]}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${(step / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: 选择用途 */}
        {step === 1 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h1 className="text-2xl font-bold text-white mb-2">你主要用 tribox 做什么？</h1>
            <p className="text-slate-400 text-sm mb-6">帮助我们为你优化体验</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {USE_CASES.map((uc) => (
                <button
                  key={uc.id}
                  type="button"
                  onClick={() => handleUseCaseSelect(uc.id)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    selectedUseCase === uc.id
                      ? 'border-indigo-500 bg-indigo-500/10 shadow shadow-indigo-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-2">{uc.icon}</div>
                  <div className="font-semibold text-white text-sm">{uc.label}</div>
                  <div className="text-slate-500 text-xs mt-1 leading-relaxed">{uc.desc}</div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleUseCaseConfirm}
              disabled={!selectedUseCase}
              className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 text-sm font-semibold text-white transition-colors"
            >
              继续
            </button>
          </div>
        )}

        {/* Step 2: 下载客户端 */}
        {step === 2 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h1 className="text-2xl font-bold text-white mb-2">下载桌面客户端</h1>
            <p className="text-slate-400 text-sm mb-6">tribox 是桌面原生应用，请选择你的操作系统</p>

            <div className="flex flex-col gap-3 mb-6">
              {[
                { os: 'macOS', icon: '🍎', note: 'Apple Silicon + Intel · .dmg' },
                { os: 'Windows', icon: '🪟', note: 'x64 / ARM64 · .msi' },
                { os: 'Linux', icon: '🐧', note: '.AppImage / .deb / .rpm' },
              ].map((d) => (
                <a
                  key={d.os}
                  href="/download"
                  onClick={handleDownloadClick}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 hover:border-indigo-500/40 px-5 py-4 transition-colors group"
                >
                  <span className="text-2xl">{d.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors text-sm">
                      {d.os}
                    </div>
                    <div className="text-xs text-slate-500">{d.note}</div>
                  </div>
                  <span className="text-slate-500 group-hover:text-indigo-400 transition-colors">↓</span>
                </a>
              ))}
            </div>

            <p className="text-center text-xs text-slate-600">
              下载后，双击安装包完成安装，无需管理员权限
            </p>
          </div>
        )}

        {/* Step 3: 接受分享 */}
        {step === 3 && inviteToken && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">接受分享</h1>
            <p className="text-slate-400 text-sm mb-8">
              正在处理你的分享链接，接受后将获得独立副本…
            </p>

            {joinState === 'idle' && (
              <button
                type="button"
                onClick={handleJoinSpace}
                className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-sm font-semibold text-white transition-colors"
              >
                接受分享，下载副本
              </button>
            )}

            {joinState === 'loading' && (
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                <p className="text-slate-400 text-sm">正在加入…</p>
              </div>
            )}

            {joinState === 'error' && (
              <div className="flex flex-col items-center gap-4">
                <div className="text-3xl">❌</div>
                <p className="text-red-400 text-sm">{joinError}</p>
                <button
                  type="button"
                  onClick={() => setJoinState('idle')}
                  className="rounded-xl border border-white/20 hover:border-white/40 px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  重试
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: 完成 */}
        {step === 4 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 text-3xl">
              🎉
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              {joinedSpaceName ? `已接收「${joinedSpaceName}」副本！` : '欢迎使用 tribox！'}
            </h1>
            <p className="text-slate-400 text-sm mb-8">
              {joinedSpaceName
                ? '打开 tribox 桌面客户端，副本已在本地等你。'
                : '打开 tribox 桌面客户端，开始你的知识管理之旅。'}
            </p>

            <button
              type="button"
              onClick={handleOpenInApp}
              className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/20"
            >
              在 tribox 中打开
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
