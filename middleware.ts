import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // 匹配除 api/_next/_vercel/带扩展名的资源外的所有路径
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
