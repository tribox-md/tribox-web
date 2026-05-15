'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AppleIcon, WindowsIcon, MobileIcon, DownloadArrow } from '@/components/PlatformIcon'
import { track } from '@/lib/analytics'
import { acceptInvite } from '@/lib/api'

type UseCase = 'knowledge' | 'team' | 'personal' | 'project'
type Step = 1 | 2 | 3 | 4

interface UseCaseDef {
  id: UseCase
  icon: string
  label: string
  desc: string
}

interface Props {
  inviteToken?: string
  sessionToken?: string
}

const PLATFORM_KEYS: Array<{ id: 'macos' | 'windows' | 'mobile'; label: string; Icon: typeof AppleIcon }> = [
  { id: 'macos', label: 'macOS', Icon: AppleIcon },
  { id: 'windows', label: 'Windows', Icon: WindowsIcon },
  { id: 'mobile', label: 'iOS / Android', Icon: MobileIcon },
]

export function OnboardingFlow({ inviteToken, sessionToken = '' }: Props) {
  const t = useTranslations('onboarding')
  const [step, setStep] = useState<Step>(1)
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null)
  const [joinState, setJoinState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [joinedSpaceName, setJoinedSpaceName] = useState('')
  const [joinError, setJoinError] = useState('')

  const useCases = t.raw('useCases') as UseCaseDef[]
  const stepNames = t.raw('stepNames') as string[]
  const platformNotes = t.raw('platforms') as Array<{ os: string; icon: string; note: string }>

  function goToStep(s: Step) {
    setStep(s)
  }

  function handleUseCaseConfirm() {
    if (!selectedUseCase) return
    track({ event: 'onboarding_step_complete', step: 'use_case', inviteToken })
    goToStep(2)
  }

  function handleDownloadClick() {
    track({ event: 'cta_click', cta: 'download' })
    track({ event: 'onboarding_step_complete', step: 'download', inviteToken })
    goToStep(inviteToken ? 3 : 4)
  }

  async function handleJoinSpace() {
    if (!inviteToken) return
    if (!sessionToken) {
      setJoinState('error')
      setJoinError(t('errorAuthRequired'))
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
      setJoinError(result.errorMessage ?? t('errorAuthRequired'))
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
            <span className="text-sm text-slate-400">{t('step', { current: step, total: stepNames.length })}</span>
            <span className="text-sm text-indigo-300 font-medium">{stepNames[step - 1]}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${(step / stepNames.length) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h1 className="text-2xl font-bold text-white mb-2">{t('step1Title')}</h1>
            <p className="text-slate-400 text-sm mb-6">{t('step1Subtitle')}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {useCases.map((uc) => (
                <button
                  key={uc.id}
                  type="button"
                  onClick={() => setSelectedUseCase(uc.id)}
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
              {t('step1Continue')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h1 className="text-2xl font-bold text-white mb-2">{t('step2Title')}</h1>
            <p className="text-slate-400 text-sm mb-6">{t('step2Subtitle')}</p>

            <div className="flex flex-col gap-3 mb-6">
              {PLATFORM_KEYS.map(({ id, label, Icon }) => {
                const note = platformNotes.find((p) => p.os === label)?.note ?? ''
                return (
                  <a
                    key={id}
                    href="/download"
                    onClick={handleDownloadClick}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 hover:border-indigo-500/40 px-5 py-4 transition-colors group"
                  >
                    <Icon size={28} className="text-slate-200" />
                    <div className="flex-1">
                      <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors text-sm">
                        {label}
                      </div>
                      <div className="text-xs text-slate-500">{note}</div>
                    </div>
                    <DownloadArrow
                      size={18}
                      className="text-slate-500 group-hover:text-indigo-400 transition-colors"
                    />
                  </a>
                )
              })}
            </div>

            <p className="text-center text-xs text-slate-600">{t('step2Footer')}</p>
          </div>
        )}

        {step === 3 && inviteToken && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">{t('step3Title')}</h1>
            <p className="text-slate-400 text-sm mb-8">{t('step3Subtitle')}</p>

            {joinState === 'idle' && (
              <button
                type="button"
                onClick={handleJoinSpace}
                className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-sm font-semibold text-white transition-colors"
              >
                {t('step3Cta')}
              </button>
            )}

            {joinState === 'loading' && (
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                <p className="text-slate-400 text-sm">{t('step3Loading')}</p>
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
                  {t('step3Retry')}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 text-3xl">
              🎉
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              {joinedSpaceName ? t('step4TitleJoined', { name: joinedSpaceName }) : t('step4Title')}
            </h1>
            <p className="text-slate-400 text-sm mb-8">
              {joinedSpaceName ? t('step4BodyJoined') : t('step4Body')}
            </p>

            <button
              type="button"
              onClick={handleOpenInApp}
              className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/20"
            >
              {t('step4Cta')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
