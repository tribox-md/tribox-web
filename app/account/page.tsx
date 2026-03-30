import type { Metadata } from 'next'
import { AccountDashboard } from '@/components/AccountDashboard'

export const metadata: Metadata = {
  title: '账号',
  description: '管理你的 tribox 账号、订阅与设备。',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ subscribed?: string }>
}

export default async function AccountPage({ searchParams }: PageProps) {
  const params = await searchParams
  return <AccountDashboard justSubscribed={params.subscribed === '1'} />
}
