import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '退款政策 — tribox',
  description: 'tribox 订阅服务的退款政策。Sync 14 天无理由退款，Catalyst 不退款。',
}

const LAST_UPDATED = '2026-05-15'

export default function RefundPage() {
  return (
    <div className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-3">
            法律
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            退款政策
          </h1>
          <p className="text-slate-500 text-sm">最后更新：{LAST_UPDATED}</p>
        </div>

        <div className="mb-12 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6">
          <h2 className="text-lg font-semibold text-indigo-200 mb-3">速览</h2>
          <ul className="text-slate-300 leading-relaxed space-y-2 list-disc pl-5">
            <li>
              <strong>tribox Sync</strong>：首次付款后 14 天内无理由全额退款
            </li>
            <li>
              <strong>tribox Catalyst</strong>（一次性买断）：不支持退款
            </li>
            <li>
              <strong>取消订阅</strong>：随时可在 Customer Portal 取消，服务持续到付费周期结束
            </li>
          </ul>
        </div>

        <Section title="1. tribox Sync 订阅退款">
          <h3 className="text-base font-semibold text-slate-200 mb-2">14 天无理由退款</h3>
          <p>
            自你<strong className="text-slate-200">首次</strong>订阅 tribox Sync 之日起 14
            个自然日内，无论使用了多少，都可申请全额退款。退款会原路退回支付时使用的信用卡或其他支付方式，
            通常 5-10 个工作日内到账（具体取决于发卡行）。
          </p>

          <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">续费周期不再退款</h3>
          <p>
            14 天无理由退款<strong className="text-slate-200">仅适用于首次付款</strong>。订阅自动续费后，
            续费周期的费用不退款。你可以随时取消自动续费（服务持续到当前周期结束），
            但已支付的当前周期不会按比例退款。
          </p>

          <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">如何申请退款</h3>
          <p>发邮件到 hello@tribox.md，包含：</p>
          <ul>
            <li>注册时使用的邮箱地址</li>
            <li>订阅日期（大致即可）</li>
            <li>简单说明退款原因（可选，但有助于我们改进产品）</li>
          </ul>
          <p>
            我们会在 2 个工作日内回复并处理。
          </p>
        </Section>

        <Section title="2. tribox Catalyst 一次性买断">
          <p>
            tribox Catalyst（创始会员档）<strong className="text-slate-200">不支持退款</strong>。
            原因是：
          </p>
          <ul>
            <li>Catalyst 的本质类似众筹支持，购买即代表对 tribox 团队的信任投票</li>
            <li>购买后立即解锁全部权益（beta 通道、社区徽章、致谢页留名）</li>
            <li>这些权益一旦授予无法收回</li>
          </ul>
          <p>
            请在购买 Catalyst 前充分了解其性质。如果你只是想试用 tribox 的功能，
            请使用永久免费的基础 app，不需要购买 Catalyst。
          </p>
        </Section>

        <Section title="3. 取消订阅 vs 退款">
          <p>这两个操作不同：</p>
          <ul>
            <li>
              <strong className="text-slate-200">取消订阅</strong>
              ：停止下次自动续费，当前付费周期内服务正常使用直到到期。无须联系客服，可在
              Stripe Customer Portal 自助操作
            </li>
            <li>
              <strong className="text-slate-200">退款</strong>：退还已支付的费用并立即终止服务。需联系
              hello@tribox.md 并符合 14 天无理由条件
            </li>
          </ul>
          <p>
            大多数情况下，<strong className="text-slate-200">取消订阅</strong>
            是更合适的选择——可以继续使用到当前周期结束。
          </p>
        </Section>

        <Section title="4. 异常情况">
          <h3 className="text-base font-semibold text-slate-200 mb-2">服务无法使用</h3>
          <p>
            如果你的订阅期间 tribox Sync 服务持续 24 小时以上无法使用，且我们未提前通知，
            可申请按比例退还受影响时段的费用。
          </p>

          <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">误操作 / 重复扣费</h3>
          <p>
            因系统问题导致的重复扣费、误扣费，将无条件全额退还，不受 14 天限制。
            发邮件附上 Stripe 收据即可。
          </p>

          <h3 className="text-base font-semibold text-slate-200 mb-2 mt-6">争议处理</h3>
          <p>
            我们倾向于通过邮件友好解决争议。如果你已经向发卡行发起 chargeback（争议扣款），
            我们将暂停账号直到争议结束。请优先邮件联系我们——我们处理速度通常快于 chargeback 流程。
          </p>
        </Section>

        <Section title="5. 联系">
          <p>
            退款相关问题：
            <a
              href="mailto:hello@tribox.md?subject=Refund%20Request"
              className="text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              hello@tribox.md
            </a>
          </p>
        </Section>

        <div className="mt-16 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">{title}</h2>
      <div className="space-y-4 text-slate-400 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:my-3">
        {children}
      </div>
    </section>
  )
}
