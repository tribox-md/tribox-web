import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SignupForm } from '@/components/SignupForm'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'signup' })
  return { title: t('title') }
}

export default async function SignupPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <SignupForm />
    </div>
  )
}
