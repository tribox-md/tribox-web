import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '注册 tribox 账号',
  description: '在 tribox 桌面客户端中完成账号注册，再回到网页订阅或管理。',
}

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 text-2xl">
              💻
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              在桌面客户端注册
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              tribox 账号涉及端到端加密的密钥派生，注册流程在桌面客户端完成更安全。
            </p>
          </div>

          <ol className="space-y-4 mb-8 text-sm">
            <Step
              n={1}
              title="下载并安装 tribox"
              body="选择适合你的操作系统，安装后无需注册即可开始使用全部本地功能。"
            />
            <Step
              n={2}
              title="在设置 → 账号中注册"
              body="打开 tribox 设置面板，选择「创建账号」，填写邮箱和密码。整个过程在你本地完成密钥生成。"
            />
            <Step
              n={3}
              title="回到 tribox.md 登录"
              body="用同一组邮箱密码在网页登录，即可订阅 Sync 或管理已有订阅。"
            />
          </ol>

          <div className="flex flex-col gap-3">
            <Link
              href="/download"
              className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 text-center text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/20"
            >
              下载桌面客户端
            </Link>
            <Link
              href="/login"
              className="w-full rounded-xl border border-white/20 hover:border-white/40 px-6 py-3 text-center text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              已有账号？登录
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 leading-relaxed">
          为什么不在网页直接注册？
          <br />
          注册涉及为你的 vault 生成端到端加密密钥，由桌面客户端完成可避免密钥经网页传输的风险。
          这是与 Obsidian Sync 类似的安全设计。
        </p>
      </div>
    </div>
  )
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
        {n}
      </div>
      <div>
        <div className="font-semibold text-white mb-0.5">{title}</div>
        <div className="text-slate-400 leading-relaxed">{body}</div>
      </div>
    </li>
  )
}
