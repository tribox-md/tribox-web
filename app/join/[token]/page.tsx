import type { Metadata } from 'next'
import { getShareLinkPreview } from '@/lib/api'
import { InviteLandingPage, InvalidInvitePage } from '@/components/InviteLandingPage'

interface Props {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params
  const preview = await getShareLinkPreview(token)

  if (!preview || !preview.valid) {
    return {
      title: '邀请链接已失效 — tribox',
    }
  }

  return {
    title: `${preview.inviterName} 邀请你加入 tribox`,
    description: `加入「${preview.spaceDisplayName}」，${preview.memberCount} 位协作者正在使用 tribox 协同工作。`,
    openGraph: {
      title: `${preview.inviterName} 邀请你加入 tribox`,
      description: `加入「${preview.spaceDisplayName}」协作空间`,
    },
  }
}

export default async function JoinPage({ params }: Props) {
  const { token } = await params
  const preview = await getShareLinkPreview(token)

  if (!preview || !preview.valid) {
    return <InvalidInvitePage />
  }

  return <InviteLandingPage token={token} preview={preview} />
}
