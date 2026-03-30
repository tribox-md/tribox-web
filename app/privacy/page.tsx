import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '隐私政策 — tribox',
  description: 'tribox 的隐私承诺：本地优先，零遥测，端到端加密同步。',
}

const LAST_UPDATED = '2026-05-15'

export default function PrivacyPage() {
  return (
    <div className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400/80 font-medium mb-3">
            法律
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            隐私政策
          </h1>
          <p className="text-slate-500 text-sm">最后更新：{LAST_UPDATED}</p>
        </div>

        {/* TL;DR */}
        <div className="mb-12 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6">
          <h2 className="text-lg font-semibold text-indigo-200 mb-3">一句话总结</h2>
          <p className="text-slate-300 leading-relaxed">
            tribox 桌面 app 默认完全本地运行，零遥测，零分析。云端服务（Sync、Catalyst、邀请分享）
            仅在你主动注册账号并使用时才收集必要的最少信息，且所有笔记内容在传输和存储时均端到端加密。
          </p>
        </div>

        <Section title="1. 桌面客户端（基础 app）">
          <p>
            tribox 桌面客户端默认不向我们的服务器发送任何数据。具体来说：
          </p>
          <ul>
            <li>无遥测、无使用统计、无崩溃报告自动上报</li>
            <li>无内置广告 SDK、无第三方追踪</li>
            <li>所有笔记、设置、附件都存储在你本地磁盘</li>
            <li>
              本地 AI 功能（Ollama）完全离线；云端 AI 仅在你主动配置 API key
              并发起请求时才连接
            </li>
          </ul>
          <p>
            <strong className="text-slate-200">你不需要注册账号就能使用 tribox 桌面客户端。</strong>
          </p>
        </Section>

        <Section title="2. 注册账号时收集什么">
          <p>当你订阅 Sync、Catalyst 或接受快照分享时需要注册账号。我们仅收集：</p>
          <ul>
            <li>邮箱地址（用于登录、密码重置、订阅通知）</li>
            <li>加密后的密码（bcrypt 哈希，原文从不存储）</li>
            <li>设备 ID（用于多设备会话管理与撤销）</li>
            <li>注册时间、最后登录时间</li>
          </ul>
          <p>
            我们<strong className="text-slate-200">不收集</strong>姓名、电话、地址、性别、生日，
            也不要求你绑定社交账号。
          </p>
        </Section>

        <Section title="3. tribox Sync — 笔记同步的加密">
          <p>
            订阅 Sync 后，你的笔记会通过我们的服务器在你的设备之间同步。但服务器无法读取你的笔记内容：
          </p>
          <ul>
            <li>
              <strong className="text-slate-200">端到端加密</strong>：所有笔记在你的本地设备用
              AES-256 加密后才上传，密钥从你的密码派生
            </li>
            <li>
              <strong className="text-slate-200">零知识架构</strong>
              ：tribox 工作人员、服务器管理员、数据库都看不到你的笔记原文
            </li>
            <li>
              <strong className="text-slate-200">忘记密码 = 数据无法找回</strong>
              ：除非你提前设置了恢复密钥
            </li>
          </ul>
        </Section>

        <Section title="4. 支付信息">
          <p>
            付款通过 Stripe 处理。我们<strong className="text-slate-200">不接触</strong>你的信用卡号、
            CVV 或银行账户。Stripe 只把以下信息回传给我们：
          </p>
          <ul>
            <li>订阅状态（active / past_due / canceled）</li>
            <li>当前订阅档位</li>
            <li>下次扣费时间</li>
            <li>发票 ID（用于客户支持）</li>
          </ul>
          <p>
            Stripe 的隐私政策见：
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              stripe.com/privacy
            </a>
          </p>
        </Section>

        <Section title="5. 网站的极简埋点">
          <p>
            tribox 官网（你正在浏览的这个站）收集以下匿名指标，用于了解哪些内容对用户有用：
          </p>
          <ul>
            <li>页面浏览（路径、referer、UA），不绑定个人身份</li>
            <li>下载按钮点击</li>
            <li>定价页 CTA 点击</li>
          </ul>
          <p>
            我们不使用 Google Analytics 或 Facebook Pixel。无 cookie 弹窗，因为我们不放追踪 cookie。
          </p>
        </Section>

        <Section title="6. 你的权利">
          <p>你随时可以：</p>
          <ul>
            <li>导出你的所有笔记（它们一直就在你本地的 .md 文件里）</li>
            <li>删除账号（联系 hello@tribox.md，3 个工作日内完成）</li>
            <li>取消订阅而保留账号</li>
            <li>查询 tribox 服务器存有你的哪些数据</li>
          </ul>
        </Section>

        <Section title="7. 联系">
          <p>
            隐私相关问题请邮件：
            <a
              href="mailto:privacy@tribox.md"
              className="text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              privacy@tribox.md
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
