import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/legal/privacy', destination: '/privacy', permanent: true },
      { source: '/legal/terms', destination: '/terms', permanent: true },
      { source: '/legal/cookie', destination: '/cookie', permanent: true },
      { source: '/legal/subprocessors', destination: '/subprocessors', permanent: true },
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
