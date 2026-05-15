import { cookies } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import { OnboardingFlow } from '@/components/OnboardingFlow'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ invite_token?: string }>
}

export default async function OnboardingPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const { invite_token: inviteToken } = await searchParams

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('tribox_session')?.value ?? ''

  return <OnboardingFlow inviteToken={inviteToken} sessionToken={sessionToken} />
}
