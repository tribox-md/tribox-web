import { defineRouting } from 'next-intl/routing'

/**
 * tribox 三语支持：英文（默认，海外为主）/ 中文 / 日语
 *
 * 路由策略 'as-needed'：默认 locale（en）不带前缀，其他语言带前缀。
 *   /          → 英文首页（默认）
 *   /zh        → 中文首页
 *   /ja        → 日语首页
 *
 * 浏览器 Accept-Language 自动检测 + 重定向由 middleware 处理。
 */
export const routing = defineRouting({
  locales: ['en', 'zh', 'ja'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
})

export type Locale = (typeof routing.locales)[number]
