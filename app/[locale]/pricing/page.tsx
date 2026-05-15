import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PricingPage } from '@/components/PricingPage'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pricing' })
  return { title: t('title') }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <PricingPage />
}
