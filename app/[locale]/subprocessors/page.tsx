import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LegalDocumentPage } from '@/components/LegalDocumentPage'

interface Props {
  params: Promise<{ locale: string }>
}

const LAST_UPDATED = '2026-05-19'

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'subprocessors' })
  return { title: t('title') }
}

export default async function SubprocessorsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <LegalDocumentPage namespace="subprocessors" lastUpdated={LAST_UPDATED} />
}
