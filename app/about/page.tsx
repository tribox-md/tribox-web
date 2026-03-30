import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '关于 tribox',
  description: 'tribox 由独立小团队开发，不接受 VC 融资，靠用户付费支撑。本地优先，文件即真理。',
}

export default function AboutPage() {
  return (
    <div className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        {/* 标题 */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-4">
            关于我们
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
            做一款十年后还想用的工具。
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            tribox 由一个相信"工具应该让用户更自由，而不是更依赖"的小团队开发。
          </p>
        </div>

        {/* 我们是谁 */}
        <Section title="我们是谁">
          <p>
            tribox 由一支独立小团队全资开发，没有外部投资人，没有融资轮次，没有"增长 KPI"。
          </p>
          <p>
            团队成员长期使用 Obsidian、Notion、Roam 等工具，但都在某个时刻被"数据被锁在云端"
            "被迫迁就软件设计"
            "厂商倒闭笔记就消失"的恐惧戳中。所以我们决定自己做一款笔记应用——
            <span className="text-slate-200">
              先保证不会让用户付出这种代价，再谈功能丰富与否。
            </span>
          </p>
        </Section>

        {/* 我们的承诺 */}
        <Section title="我们的承诺">
          <p>
            tribox 永远不会做以下事情。这不是营销话术，而是写在产品架构里的约束：
          </p>
          <ul className="list-disc pl-5 space-y-2.5 text-slate-400">
            <li>
              <strong className="text-slate-200">不把你的笔记锁进数据库。</strong>
              所有笔记都是磁盘上真实的 Markdown 文件，VSCode / Sublime / vim 都能直接打开。
            </li>
            <li>
              <strong className="text-slate-200">不偷偷写你的文件。</strong>
              AI 生成的内容必须先经过你的确认（草稿 → 预览 → 接受三段流程）才能落入笔记。
            </li>
            <li>
              <strong className="text-slate-200">不做多人实时协作编辑。</strong>
              我们相信深度思考需要独处的空间。需要分享时，用快照分享——对方拿到独立副本。
            </li>
            <li>
              <strong className="text-slate-200">不做"功能墙"逼你升级。</strong>
              基础 app 永久免费，所有本地功能都包含。Sync 等付费产品只是云端基础设施，不是功能限制。
            </li>
            <li>
              <strong className="text-slate-200">不接受 VC 融资。</strong>
              一旦接受外部投资，董事会就会要求增长曲线，我们就会被推着做不利于用户的设计。
            </li>
          </ul>
        </Section>

        {/* 商业模式 */}
        <Section title="我们怎么活下来">
          <p>tribox 的全部收入来自用户付费的附加产品：</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>
              <strong className="text-slate-200">tribox Sync</strong> — 多端同步订阅（$4-5/月）
            </li>
            <li>
              <strong className="text-slate-200">tribox Catalyst</strong> — 一次性创始会员档（$35）
            </li>
            <li>
              <strong className="text-slate-200">Commercial License</strong> —
              企业组织的道德倡议许可
            </li>
          </ul>
          <p>
            如果你或你的公司在依赖 tribox 创造价值，订阅是支持 tribox
            保持独立最直接的方式——你不是付钱购买功能，你是付钱让我们继续按现在的原则做事。
          </p>
        </Section>

        {/* 联系方式 */}
        <Section title="联系我们">
          <ul className="space-y-2 text-slate-400">
            <li>
              邮件：
              <a
                href="mailto:hello@tribox.md"
                className="text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                hello@tribox.md
              </a>
            </li>
            <li>
              商业合作：
              <a
                href="mailto:hello@tribox.md?subject=Commercial%20License"
                className="text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                hello@tribox.md
              </a>
            </li>
            <li>
              GitHub：
              <a
                href="https://github.com/tribox-md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                github.com/tribox-md
              </a>
            </li>
          </ul>
        </Section>

        {/* 返回 */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="text-2xl font-semibold text-white mb-5 tracking-tight">{title}</h2>
      <div className="space-y-4 text-slate-400 leading-relaxed">{children}</div>
    </section>
  )
}
