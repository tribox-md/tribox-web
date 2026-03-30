import type { Metadata } from 'next'
import { LoginForm } from '@/components/LoginForm'

export const metadata: Metadata = {
  title: '登录',
  description: '登录你的 tribox 账号，管理订阅与分享。',
}

interface PageProps {
  searchParams: Promise<{ redirect?: string; from?: string }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <LoginForm redirectTo={params.redirect ?? '/account'} cameFrom={params.from} />
    </div>
  )
}
