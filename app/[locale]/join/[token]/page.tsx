import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getShareLinkPreview } from '@/lib/api'
import { InviteLandingPage, InvalidInvitePage } from '@/components/InviteLandingPage'

interface Props {
  params: Promise<{ locale: string; token: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, token } = await params
  const preview = await getShareLinkPreview(token)
  const t = await getTranslations({ locale, namespace: 'invite' })

  if (!preview || !preview.valid) {
    return { title: t('invalidTitle') }
  }

  const title = `${preview.inviterName} → tribox`
  return {
    title,
    description: preview.spaceDisplayName,
    openGraph: { title, description: preview.spaceDisplayName },
  }
}

export default async function JoinPage({ params }: Props) {
  const { locale, token } = await params
  setRequestLocale(locale)
  const preview = await getShareLinkPreview(token)

  if (!preview || !preview.valid) {
    return <InvalidInvitePage />
  }

  return <InviteLandingPage token={token} preview={preview} />
}
