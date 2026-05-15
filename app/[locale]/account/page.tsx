import { getTranslations, setRequestLocale } from 'next-intl/server'
import { AccountDashboard } from '@/components/AccountDashboard'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ subscribed?: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'account' })
  return { title: t('title'), robots: { index: false, follow: false } }
}

export default async function AccountPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const search = await searchParams
  return <AccountDashboard justSubscribed={search.subscribed === '1'} />
}
