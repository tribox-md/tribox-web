import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Locale-aware 导航 helpers。
 * 用 `Link from '@/i18n/navigation'` 替代原生 `next/link`，
 * 这样 `<Link href="/about">` 会自动加上当前 locale 前缀。
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
