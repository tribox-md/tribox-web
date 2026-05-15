import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LoginForm } from '@/components/LoginForm'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ redirect?: string; from?: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'login' })
  return { title: t('title') }
}

export default async function LoginPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const search = await searchParams
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <LoginForm redirectTo={search.redirect ?? '/account'} cameFrom={search.from} />
    </div>
  )
}
