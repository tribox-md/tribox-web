'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { track } from '@/lib/analytics'
import { startCheckout } from '@/lib/billing'
import { isLoggedIn } from '@/lib/auth'

type BillingCycle = 'monthly' | 'annual'

// 产品分档：基础免费 / Sync 订阅 / Catalyst 一次性 / Commercial 商业许可
// 对应后端 plan_tier：free / pro / team
// Sync 与 Catalyst 都映射到 pro tier，通过 priceId 区分（月付/年付/一次性 variants）
type ProductId = 'free' | 'sync' | 'catalyst' | 'commercial'

interface Product {
  id: ProductId
  name: string
  tagline: string
  priceMonthly: string | null
  priceAnnual: string | null
  priceOneTime: string | null
  priceUnit: string
  cta: string
  ctaStyle: 'primary' | 'outline'
  highlight: boolean
  features: string[]
}

const PRODUCTS: Product[] = [
  {
    id: 'free',
    name: 'tribox',
    tagline: '基础 app —— 永久免费，无需注册',
    priceMonthly: '$0',
    priceAnnual: '$0',
    priceOneTime: null,
    priceUnit: '永久免费',
    cta: '免费下载',
    ctaStyle: 'outline',
    highlight: false,
    features: [
      'Markdown 文件存储，数据永远属于你',
      '双向链接 [[WikiLink]] 与知识图谱',
      'Tantivy 全文搜索 + 语义检索',
      '任务管理：@due / @priority 内嵌语法',
      'AI Copilot（支持本地 Ollama 模型）',
      '插件系统',
      '快照分享：发出本地副本给他人',
      '社区支持',
    ],
  },
  {
    id: 'sync',
    name: 'tribox Sync',
    tagline: '一个账号，多台设备，同一份笔记',
    priceMonthly: '$5',
    priceAnnual: '$4',
    priceOneTime: null,
    priceUnit: '每月',
    cta: '订阅 Sync',
    ctaStyle: 'primary',
    highlight: true,
    features: [
      '端到端加密的多端同步（AES-256）',
      '版本历史，最长 12 个月',
      '已删除文件可恢复',
      '可选择按文件夹同步',
      '设置、主题、插件同步',
      '附件云存储 10 GB',
      '邮件技术支持',
    ],
  },
  {
    id: 'catalyst',
    name: 'tribox Catalyst',
    tagline: '创始会员档 —— 一次买断，永久铭记',
    priceMonthly: null,
    priceAnnual: null,
    priceOneTime: '$35',
    priceUnit: '一次性',
    cta: '成为创始会员',
    ctaStyle: 'outline',
    highlight: false,
    features: [
      '提前体验 beta 通道与新功能',
      '官网致谢页留名（可选）',
      '社区创始会员徽章',
      '插件开发者优先访问',
      '支持独立开发，不依赖风险投资',
    ],
  },
]

const COMPARISON_ROWS = [
  { label: '本地 Markdown 文件存储', free: '✓', sync: '✓', catalyst: '✓' },
  { label: '双向链接 + 图谱', free: '✓', sync: '✓', catalyst: '✓' },
  { label: '全文搜索 + 语义检索', free: '✓', sync: '✓', catalyst: '✓' },
  { label: 'AI Copilot（本地模型）', free: '✓', sync: '✓', catalyst: '✓' },
  { label: '快照分享', free: '✓', sync: '✓', catalyst: '✓' },
  { label: '多端云同步', free: '—', sync: '✓ E2E 加密', catalyst: '需另订' },
  { label: '版本历史', free: '—', sync: '12 个月', catalyst: '需另订' },
  { label: '附件云存储', free: '—', sync: '10 GB', catalyst: '需另订' },
  { label: 'beta 通道', free: '—', sync: '—', catalyst: '✓' },
  { label: '社区徽章', free: '—', sync: '—', catalyst: '✓ 创始会员' },
]

const FAQS = [
  {
    q: '免费版有功能限制吗？',
    a: '没有。tribox 基础 app 永久免费，所有本地功能（编辑、搜索、AI Copilot、插件、快照分享）都包含在内，不强制注册账号。Sync 和 Catalyst 是独立的可选附加产品，只有当你需要时才付费。',
  },
  {
    q: 'Sync 是多人协作吗？',
    a: '不是。tribox Sync 服务于一个人在多台设备之间的衔接（手机记下灵感，桌面继续展开）。tribox 永远不会做多人实时协作编辑——我们相信深度思考需要独处的空间。如果你想把笔记给别人看，请使用免费的"快照分享"功能：对方得到独立副本，可自由修改。',
  },
  {
    q: '我的笔记会被上传到云端吗？',
    a: '默认不会。基础 app 完全本地运行，零遥测。只有当你主动订阅 Sync 后，文件才会以端到端加密的形式同步到 tribox 服务器（我们也读不到你的内容）。你可以随时退出 Sync，本地文件永远是真相源。',
  },
  {
    q: '我用 tribox 工作（商业用途）需要额外付费吗？',
    a: '不强制。tribox 没有"商业墙"，你完全可以免费用于工作。但如果你或你的公司在依赖 tribox 创造价值，欢迎订阅 Sync 或 Catalyst 来支持独立开发——我们不接受 VC 融资，用户付费是 tribox 唯一的收入来源。',
  },
  {
    q: '取消订阅后我的笔记会怎样？',
    a: '完全不影响。所有笔记都以 Markdown 文件存在你的本地磁盘，Sync 只是同步通道。取消订阅后笔记原样保留，只是不再向云端同步新变更。',
  },
  {
    q: '支持退款吗？',
    a: 'Sync 订阅 14 天内无理由全额退款。Catalyst 一次性买断不退款（这是支持档，类似众筹）。',
  },
  {
    q: '学生 / 教师 / 非营利组织有折扣吗？',
    a: '正在筹备中。请发邮件到 hello@tribox.md 说明身份，我们会逐封回复。',
  },
  {
    q: 'Self-hosted 选项？',
    a: 'tribox-sync-server 开源（与 tribox 应用同 GitHub 组织），可自建。Self-hosted 适合企业内网或对数据主权有更高要求的用户。',
  },
]

export function PricingPage() {
  const router = useRouter()
  const [billing, setBilling] = useState<BillingCycle>('annual')
  const [checkingOut, setCheckingOut] = useState<ProductId | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  async function handleCta(productId: ProductId) {
    track({ event: 'cta_click', cta: 'pricing' })
    setCheckoutError(null)

    if (productId === 'free') {
      window.location.href = '/download'
      return
    }

    if (productId === 'commercial') {
      window.location.href = 'mailto:hello@tribox.md?subject=Commercial%20License%20Inquiry'
      return
    }

    // Sync / Catalyst 都需要登录态才能创建 Stripe Checkout（绑定 stripe_customer_id 到用户）
    if (!isLoggedIn()) {
      router.push(`/login?redirect=/pricing&from=pricing`)
      return
    }

    setCheckingOut(productId)
    try {
      // Sync 和 Catalyst 都映射到后端 pro tier；具体价格变体由后端 priceId 决定
      // 月付/年付 切换通过 priceId 区分（后端配置 STRIPE_PRICE_IDS_PRO=price_xxx,price_yyy）
      // 未来扩展：priceId 通过环境变量或后端按 cycle 自动选；当前不传，由后端选 tier 默认 priceId
      await startCheckout({ planTier: 'pro' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes('需要登录') || msg.includes('会话已过期')) {
        router.push('/login?redirect=/pricing&from=pricing')
        return
      }
      setCheckoutError(msg)
      setCheckingOut(null)
    }
  }

  return (
    <div className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* 标题 */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-4">
            定价
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            基础免费，按需付费。
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            tribox 本身永久免费、无功能墙、无注册要求。
            <br />
            Sync 与 Catalyst 是独立的可选附加产品，只在你需要时付费。
          </p>

          {/* 月付/年付切换 */}
          <div className="mt-10 inline-flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                billing === 'monthly'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              月付
            </button>
            <button
              type="button"
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                billing === 'annual' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              年付
              <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-xs text-indigo-300">
                省 20%
              </span>
            </button>
          </div>
        </div>

        {/* 错误条 */}
        {checkoutError && (
          <div className="max-w-2xl mx-auto mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 text-center">
            {checkoutError}
          </div>
        )}

        {/* 产品卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PRODUCTS.map((product) => {
            const isSubscription = product.priceMonthly !== null
            const displayPrice = isSubscription
              ? billing === 'annual'
                ? product.priceAnnual
                : product.priceMonthly
              : product.priceOneTime

            return (
              <div
                key={product.id}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  product.highlight
                    ? 'border-indigo-500/50 bg-indigo-500/5 shadow-lg shadow-indigo-500/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {product.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-semibold text-white whitespace-nowrap">
                    最受欢迎
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white mb-1">{product.name}</h2>
                  <p className="text-xs text-slate-500 mb-4">{product.tagline}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">{displayPrice}</span>
                    {isSubscription && product.id !== 'free' && (
                      <span className="text-slate-500 text-sm mb-1">/月</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {product.id === 'free' && '永久免费'}
                    {product.id === 'sync' &&
                      (billing === 'annual' ? '按年计费 $48/年' : '按月计费')}
                    {product.id === 'catalyst' && '一次性买断，无续费'}
                  </p>
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="mt-0.5 text-indigo-400 flex-shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleCta(product.id)}
                  disabled={checkingOut !== null}
                  className={`block w-full rounded-xl px-6 py-3 text-center text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    product.ctaStyle === 'primary'
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                      : 'border border-white/20 hover:border-white/40 text-slate-300 hover:text-white'
                  }`}
                >
                  {checkingOut === product.id ? '正在跳转支付…' : product.cta}
                </button>
              </div>
            )
          })}
        </div>

        {/* Commercial / Self-hosted 横幅 */}
        <div className="mb-24 rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium mb-2">
                Commercial / Self-hosted
              </p>
              <h3 className="text-lg font-semibold text-white mb-2">
                团队、企业、政府机构使用？
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                tribox 没有"商业墙"，你完全可以免费用于工作。但如果你或公司在依赖 tribox
                创造价值，欢迎订阅 Commercial 计划支持独立开发，或自建
                tribox-sync-server（开源）用于内网部署。
              </p>
            </div>
            <a
              href="mailto:hello@tribox.md?subject=Commercial%20License%20Inquiry"
              className="flex-shrink-0 rounded-xl border border-white/20 hover:border-white/40 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white transition-colors whitespace-nowrap"
            >
              联系我们
            </a>
          </div>
        </div>

        {/* 功能对比表 */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold text-white text-center mb-3 tracking-tight">
            功能对比
          </h2>
          <p className="text-slate-500 text-center text-sm mb-10">
            基础 app 已包含全部本地功能。Sync 与 Catalyst 解锁额外能力。
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-6 text-left text-slate-400 font-medium w-1/2">功能</th>
                  <th className="py-4 px-4 text-center text-slate-300 font-semibold">tribox</th>
                  <th className="py-4 px-4 text-center text-indigo-300 font-semibold">Sync</th>
                  <th className="py-4 px-4 text-center text-slate-300 font-semibold">Catalyst</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                  >
                    <td className="py-3.5 px-6 text-slate-300">{row.label}</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">{row.free}</td>
                    <td className="py-3.5 px-4 text-center text-indigo-300 font-medium">
                      {row.sync}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-300">{row.catalyst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-white text-center mb-10 tracking-tight">
            常见问题
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-12">
            还有问题？发邮件到{' '}
            <a
              href="mailto:hello@tribox.md"
              className="text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              hello@tribox.md
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
