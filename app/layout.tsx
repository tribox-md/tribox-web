import type { ReactNode } from 'react'
import './globals.css'

type Props = {
  children: ReactNode
}

// 此根 layout 是 next-intl 推荐的 passthrough 模式：
// 真正的 html/body/metadata 渲染在 app/[locale]/layout.tsx，
// 那里可以根据 locale 设置 lang 属性与 metadata。
export default function RootLayout({ children }: Props) {
  return children
}
