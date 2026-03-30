import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'tribox — 思考，写在你自己的文件里',
  description:
    '本地优先的笔记与知识管理工具。Markdown 文件存储，双向链接，全文搜索。免费使用，无需注册。',
}

const PRINCIPLES = [
  {
    title: '属于你',
    body: '所有笔记是你磁盘上真实的 Markdown 文件。任何文本编辑器都能打开，没有专有格式，没有数据锁定。',
  },
  {
    title: '能久存',
    body: '纯文本是过去四十年都能读的格式，也会是未来四十年都能读的格式。今天写下的笔记，二十年后仍然属于你。',
  },
  {
    title: '可掌控',
    body: '离线完整可用。云端同步是你选择的功能，不是强制依赖。如果哪一天 tribox 消失，你的笔记仍在你的电脑里。',
  },
  {
    title: '可塑造',
    body: '快捷键、主题、插件、AI 模型——所有用得到的地方都可定制。你不必迁就软件，软件应该迁就你。',
  },
  {
    title: '不会偷写',
    body: 'AI 输出永远先经过你的确认才能落入笔记。tribox 不在你不知情时修改你的文件。',
  },
]

const CAPABILITIES = [
  {
    eyebrow: '思考的形状',
    title: '把想法用双向链接连起来。',
    body: '[[WikiLink]] 语法在写作中即时建立联系。每一篇笔记都知道谁链接了自己，知识图谱自动浮现，无需手动整理。',
  },
  {
    eyebrow: '当下与未来',
    title: '任务和笔记是同一件事。',
    body: '在段落里直接写 @due(2026-06-01) @priority(high)，今日视图就会看到它。任务不再被关在另一个 app 里。',
  },
  {
    eyebrow: '毫秒级',
    title: '搜索快到不像本地工具。',
    body: 'Tantivy 全文索引 + 语义向量检索，几千篇笔记下查询不超过 50ms。AI Copilot 引用真实笔记内容，不臆造。',
  },
  {
    eyebrow: '你的多端',
    title: '一个账号，多台设备，同一份笔记。',
    body: 'tribox Sync 服务于你一个人在桌面、笔电、手机之间的衔接。在地铁上记下灵感，回到桌面继续展开——同一份文件，端到端加密。',
  },
  {
    eyebrow: '分享，不是协作',
    title: '快照分享：发出去的是副本，不是活文档。',
    body: '把一个笔记或一组笔记打包发给别人，接收者得到自己的独立副本，可以自由修改。tribox 不做多人实时编辑——我们相信深度思考需要独处的空间。',
  },
  {
    eyebrow: '本地优先',
    title: '没有网络也照样工作。',
    body: '所有功能离线可用，包括 AI（接 Ollama 本地模型）。网络只在你主动同步或调用云端 AI 时才介入。',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-28 sm:py-40 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[500px] w-[800px] rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            本地优先 · 文件即真理 · 开放格式
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-[1.05] tracking-tight">
            思考，
            <br />
            写在你自己的
            <br />
            <span className="text-indigo-400">文件里。</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
            tribox 是一款本地优先的笔记与知识管理工具。Markdown 文件存储，双向链接，全文搜索。
            <br />
            <span className="text-slate-500">免费使用，无需注册，无附加条件。</span>
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/download"
              className="w-full sm:w-auto rounded-xl bg-indigo-500 hover:bg-indigo-400 px-8 py-3.5 text-base font-semibold text-white transition-colors shadow-lg shadow-indigo-500/20"
            >
              免费下载 tribox
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto rounded-xl border border-white/20 hover:border-white/40 px-8 py-3.5 text-base font-semibold text-slate-300 hover:text-white transition-colors"
            >
              查看附加产品
            </Link>
          </div>

          <p className="mt-5 text-sm text-slate-600">
            macOS · Windows · Linux — 桌面优先，移动端开发中
          </p>
        </div>
      </section>

      {/* 五原则宣言 */}
      <section className="px-4 py-24 sm:py-32 border-t border-white/10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            tribox 的五条承诺
          </h2>
          <p className="text-center text-slate-400 mb-16 max-w-xl mx-auto">
            这些不是营销口号，而是我们写每一行代码时遵循的边界。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {PRINCIPLES.map((p, idx) => (
              <div key={p.title} className="flex gap-5">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-sm font-semibold">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg mb-2">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities — 抒情段落 */}
      <section className="px-4 py-24 sm:py-32 border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
            {CAPABILITIES.map((c) => (
              <div key={c.title}>
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-3">
                  {c.eyebrow}
                </p>
                <h3 className="text-2xl font-semibold text-white mb-4 leading-tight tracking-tight">
                  {c.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 独立声明 */}
      <section className="px-4 py-20 sm:py-28 border-t border-white/10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium mb-4">
            独立开发
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
            没有融资。没有 KPI。
            <br />
            只有用户。
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-xl mx-auto">
            tribox 由小团队全资开发，不接受风险投资。我们的全部收入来自用户付费的附加产品（Sync、Catalyst）。
            这意味着我们对你负责，不对董事会负责——
            <span className="text-slate-300">你是我们的客户，不是我们的产品。</span>
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block text-sm text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            了解我们的团队 →
          </Link>
        </div>
      </section>

      {/* 下载 */}
      <section
        id="download-section"
        className="px-4 py-24 sm:py-32 border-t border-white/10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            开始使用
          </h2>
          <p className="text-slate-400 mb-12">
            下载桌面客户端，无需注册账号即可使用全部本地功能。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { os: 'macOS', icon: '🍎', note: 'Apple Silicon · Intel' },
              { os: 'Windows', icon: '🪟', note: 'x64 · ARM64' },
              { os: 'Linux', icon: '🐧', note: 'AppImage · deb' },
            ].map((d) => (
              <Link
                key={d.os}
                href="/download"
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:border-indigo-500/40 p-6 transition-colors group"
              >
                <span className="text-4xl">{d.icon}</span>
                <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {d.os}
                </span>
                <span className="text-xs text-slate-500">{d.note}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
