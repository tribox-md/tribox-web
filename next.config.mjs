import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
const ACCOUNT_ORIGIN = (process.env.NEXT_PUBLIC_ACCOUNT_ORIGIN || 'https://account.tribox.md').replace(/\/$/, '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/legal/privacy', destination: '/privacy', permanent: true },
      { source: '/legal/terms', destination: '/terms', permanent: true },
      { source: '/legal/cookie', destination: '/cookie', permanent: true },
      { source: '/legal/subprocessors', destination: '/subprocessors', permanent: true },
      { source: '/login', destination: `${ACCOUNT_ORIGIN}/login`, permanent: false },
      { source: '/signup', destination: `${ACCOUNT_ORIGIN}/signup`, permanent: false },
      { source: '/account', destination: `${ACCOUNT_ORIGIN}/account`, permanent: false },
      { source: '/account/:path*', destination: `${ACCOUNT_ORIGIN}/account/:path*`, permanent: false },
      { source: '/:locale(en|zh|ja)/login', destination: `${ACCOUNT_ORIGIN}/:locale/login`, permanent: false },
      { source: '/:locale(en|zh|ja)/signup', destination: `${ACCOUNT_ORIGIN}/:locale/signup`, permanent: false },
      { source: '/:locale(en|zh|ja)/account', destination: `${ACCOUNT_ORIGIN}/:locale/account`, permanent: false },
      {
        source: '/:locale(en|zh|ja)/account/:path*',
        destination: `${ACCOUNT_ORIGIN}/:locale/account/:path*`,
        permanent: false,
      },
      { source: '/:locale(en|zh|ja)/legal/privacy', destination: '/:locale/privacy', permanent: true },
      { source: '/:locale(en|zh|ja)/legal/terms', destination: '/:locale/terms', permanent: true },
      { source: '/:locale(en|zh|ja)/legal/cookie', destination: '/:locale/cookie', permanent: true },
      {
        source: '/:locale(en|zh|ja)/legal/subprocessors',
        destination: '/:locale/subprocessors',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
