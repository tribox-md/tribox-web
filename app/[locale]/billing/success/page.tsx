import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BillingReturnPage } from '@/components/BillingReturnPage'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'billingReturn.success' })
  return { title: t('title') }
}

export default async function BillingSuccessPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <BillingReturnPage status="success" />
}
