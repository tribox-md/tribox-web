import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { OnboardingFlow } from '@/components/OnboardingFlow'

export const metadata: Metadata = {
  title: '开始使用 — tribox',
  description: '几步完成设置，开始你的知识管理之旅。',
}

interface Props {
  searchParams: Promise<{ invite_token?: string }>
}

export default async function OnboardingPage({ searchParams }: Props) {
  const { invite_token: inviteToken } = await searchParams

  // 从 cookie 读取 session token（由注册流程通过 Set-Cookie 写入）
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('tribox_session')?.value ?? ''

  return <OnboardingFlow inviteToken={inviteToken} sessionToken={sessionToken} />
}
