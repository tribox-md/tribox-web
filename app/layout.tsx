import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tribox.md'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'tribox — 思考，写在你自己的文件里',
    template: '%s · tribox',
  },
  description:
    '本地优先的笔记与知识管理桌面应用。Markdown 文件存储，双向链接，全文搜索。免费使用，无需注册。',
  keywords: [
    'tribox',
    '笔记应用',
    '本地优先',
    'local-first',
    'Markdown',
    '知识管理',
    '双向链接',
    '本地优先笔记',
    '隐私',
  ],
  authors: [{ name: 'tribox' }],
  creator: 'tribox',
  publisher: 'tribox',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: SITE_URL,
    siteName: 'tribox',
    title: 'tribox — 思考，写在你自己的文件里',
    description:
      '本地优先的笔记与知识管理桌面应用。Markdown 文件存储，双向链接，全文搜索。免费使用，无需注册。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'tribox — 思考，写在你自己的文件里',
    description: '本地优先的笔记与知识管理桌面应用。免费使用，无需注册。',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0f0f1a] text-slate-100">
        {/* 顶部导航 */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f0f1a]/80 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white text-sm font-bold">
                  T
                </span>
                <span className="text-white">tribox</span>
              </Link>

              {/* Nav links */}
              <nav className="flex items-center gap-1 sm:gap-2">
                <Link
                  href="/pricing"
                  className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  定价
                </Link>
                <Link
                  href="/about"
                  className="hidden sm:inline-block px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  关于
                </Link>
                <Link
                  href="/account"
                  className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  账号
                </Link>
                <Link
                  href="/download"
                  className="ml-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-sm font-semibold text-white transition-colors"
                >
                  下载
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <main className="flex-1">{children}</main>

        {/* 底部 Footer */}
        <footer className="border-t border-white/10 py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8 text-sm">
              <div>
                <h3 className="font-semibold text-white mb-3">产品</h3>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <Link href="/download" className="hover:text-white transition-colors">
                      下载
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-white transition-colors">
                      定价
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">关于</h3>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">
                      团队 / 哲学
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://github.com/tribox-md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">法律</h3>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <Link href="/privacy" className="hover:text-white transition-colors">
                      隐私政策
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white transition-colors">
                      服务条款
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund" className="hover:text-white transition-colors">
                      退款政策
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">联系</h3>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <a
                      href="mailto:hello@tribox.md"
                      className="hover:text-white transition-colors"
                    >
                      hello@tribox.md
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:privacy@tribox.md"
                      className="hover:text-white transition-colors"
                    >
                      privacy@tribox.md
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5 text-xs text-slate-500">
              <p>© {new Date().getFullYear()} tribox. 独立开发，不接受 VC 融资。</p>
              <p>Built with Next.js · 文件即真理</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
