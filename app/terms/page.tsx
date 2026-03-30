import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '服务条款 — tribox',
  description: 'tribox 桌面应用与订阅服务的使用条款。',
}

const LAST_UPDATED = '2026-05-15'

export default function TermsPage() {
  return (
    <div className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-3">
            法律
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            服务条款
          </h1>
          <p className="text-slate-500 text-sm">最后更新：{LAST_UPDATED}</p>
        </div>

        <div className="mb-12 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6">
          <p className="text-slate-300 leading-relaxed">
            使用 tribox 桌面客户端或订阅 tribox 云端服务，即视为你已阅读并同意以下条款。
            如果你有任何疑问，请在订阅前邮件
            <a
              href="mailto:hello@tribox.md"
              className="text-indigo-300 hover:text-indigo-200 transition-colors mx-1"
            >
              hello@tribox.md
            </a>
            。
          </p>
        </div>

        <Section title="1. 服务说明">
          <p>tribox 提供以下服务：</p>
          <ul>
            <li>
              <strong className="text-slate-200">桌面客户端</strong>：本地优先的笔记与知识管理工具，
              永久免费、无功能限制、无注册要求
            </li>
            <li>
              <strong className="text-slate-200">tribox Sync</strong>
              ：付费订阅服务，提供端到端加密的多端同步、版本历史、附件云存储
            </li>
            <li>
              <strong className="text-slate-200">tribox Catalyst</strong>
              ：一次性买断的创始会员档，提供 beta 通道与社区徽章
            </li>
            <li>
              <strong className="text-slate-200">快照分享</strong>
              ：在用户之间传递笔记副本的功能（免费）
            </li>
          </ul>
        </Section>

        <Section title="2. 账号责任">
          <ul>
            <li>账号密码由你自行保管。tribox 采用零知识加密，密码丢失意味着同步数据无法找回。</li>
            <li>同一账号同时登录的设备数受订阅档位限制，可在用户中心查看与撤销。</li>
            <li>
              禁止将账号转让、出租、共享给他人。订阅许可面向个人或单一组织实体，不是"团队席位"。
            </li>
            <li>
              如发现账号异常，应立即修改密码并联系
              <a
                href="mailto:hello@tribox.md"
                className="text-indigo-300 hover:text-indigo-200 transition-colors mx-1"
              >
                hello@tribox.md
              </a>
              。
            </li>
          </ul>
        </Section>

        <Section title="3. 订阅计费与退款">
          <ul>
            <li>
              <strong className="text-slate-200">订阅周期</strong>
              ：Sync 按月或按年订阅，到期自动续费，可随时取消续费
            </li>
            <li>
              <strong className="text-slate-200">退款政策</strong>
              ：Sync 订阅首次付款后 14 天内可申请全额退款；Catalyst
              一次性买断不退款（性质类似众筹支持）
            </li>
            <li>
              <strong className="text-slate-200">价格调整</strong>
              ：tribox 有权调整未来订阅周期的价格，调整前 30 天会邮件通知。已支付的当前周期不受影响
            </li>
            <li>
              <strong className="text-slate-200">税费</strong>：展示价格不含可能适用的当地税费
            </li>
          </ul>
        </Section>

        <Section title="4. 取消订阅">
          <ul>
            <li>你可以在 Stripe Customer Portal 随时取消订阅，无需联系客服</li>
            <li>取消后服务持续到当前付费周期结束，到期后停止同步</li>
            <li>
              本地笔记<strong className="text-slate-200">完全不受影响</strong>
              ——所有 Markdown 文件原样保留在你的磁盘
            </li>
            <li>账号本身保留 12 个月，期间可重新订阅恢复同步</li>
          </ul>
        </Section>

        <Section title="5. 可接受使用">
          <p>使用 tribox 服务时，你同意不会：</p>
          <ul>
            <li>用于存储或分发违反所在地法律的内容</li>
            <li>逆向工程或试图破坏 tribox 服务器</li>
            <li>使用自动化脚本异常消耗云端资源（API 滥用、爬取等）</li>
            <li>侵犯他人版权、商标、隐私权</li>
          </ul>
          <p>
            违反上述条款可能导致账号被暂停或终止。tribox 保留对内容的最终审核权，
            但<strong className="text-slate-200">不会主动扫描或读取</strong>
            你的笔记内容（零知识架构使我们也读不到）。
          </p>
        </Section>

        <Section title="6. 服务可用性">
          <ul>
            <li>
              tribox 努力维持云端服务 99.9% 的月度可用性，但<strong className="text-slate-200">
                不提供 SLA 担保
              </strong>
            </li>
            <li>
              服务中断时，本地客户端仍可正常使用——这是本地优先架构的核心承诺
            </li>
            <li>计划内的维护窗口会提前 48 小时通过邮件或站内公告通知</li>
          </ul>
        </Section>

        <Section title="7. 责任限制">
          <p>
            在法律允许的最大范围内，tribox 对因服务使用导致的任何间接、特殊或后果性损失不承担责任。
            tribox 的全部赔偿责任不超过你在过去 12 个月支付的订阅费用。
          </p>
        </Section>

        <Section title="8. 条款变更">
          <p>
            tribox 可能不时更新本服务条款。重大变更会通过邮件通知所有付费订阅用户，
            并在网站上提前公告 30 天。继续使用即视为接受新条款。
          </p>
        </Section>

        <Section title="9. 适用法律">
          <p>本条款适用中华人民共和国法律。争议优先通过协商解决。</p>
        </Section>

        <Section title="10. 联系">
          <p>
            条款相关问题：
            <a
              href="mailto:hello@tribox.md"
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
