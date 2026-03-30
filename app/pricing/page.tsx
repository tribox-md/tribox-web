import type { Metadata } from 'next'
import { PricingPage } from '@/components/PricingPage'

export const metadata: Metadata = {
  title: '定价 — tribox',
  description: '从免费开始，按需升级。所有计划均可本地离线使用，数据永远属于你。',
}

export default function Page() {
  return <PricingPage />
}
