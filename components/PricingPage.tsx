'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { track } from '@/lib/analytics'
import { startCheckout } from '@/lib/billing'
import { isLoggedIn } from '@/lib/auth'

type BillingCycle = 'monthly' | 'annual'
type ProductId = 'free' | 'pro' | 'credits' | 'commercial'

interface Product {
  id: ProductId
  priceMonthly: string | null
  priceAnnual: string | null
  priceOneTime: string | null
  ctaStyle: 'primary' | 'outline'
  highlight: boolean
  featuresCount: number
  annualTotalDisplay?: string
}

const PRODUCTS: Product[] = [
  {
    id: 'free',
    priceMonthly: '$0',
    priceAnnual: '$0',
    priceOneTime: null,
    ctaStyle: 'outline',
    highlight: false,
    featuresCount: 8,
  },
  {
    id: 'pro',
    priceMonthly: '$9',
    priceAnnual: '$90',
    priceOneTime: null,
    ctaStyle: 'primary',
    highlight: true,
    featuresCount: 7,
    annualTotalDisplay: '$90',
  },
  {
    id: 'credits',
    priceMonthly: null,
    priceAnnual: null,
    priceOneTime: '$10',
    ctaStyle: 'outline',
    highlight: false,
    featuresCount: 5,
  },
]

const PRO_PRICE_IDS: Partial<Record<BillingCycle, string>> = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY?.trim(),
  annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY?.trim(),
}
const AI_CREDIT_PACK_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_AI_CREDIT_PACK?.trim()

interface ComparisonRow {
  label: string
  free: string
  pro: string
  credits: string
}

interface FaqItem {
  q: string
  a: string
}

export function PricingPage() {
  const t = useTranslations('pricing')
  const router = useRouter()
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const [checkingOut, setCheckingOut] = useState<ProductId | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const rows = t.raw('comparison.rows') as ComparisonRow[]
  const faqs = t.raw('faqs') as FaqItem[]

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
    if (!isLoggedIn()) {
      router.push(`/login?redirect=/pricing&from=pricing`)
      return
    }

    setCheckingOut(productId)
    try {
      if (productId === 'credits') {
        await startCheckout({
          checkoutType: 'ai_credit_pack',
          ...(AI_CREDIT_PACK_PRICE_ID ? { priceId: AI_CREDIT_PACK_PRICE_ID } : {}),
        })
      } else {
        const priceId = PRO_PRICE_IDS[billing]
        if (billing === 'annual' && !priceId) {
          setCheckoutError(t('annualCheckoutUnavailable'))
          setCheckingOut(null)
          return
        }
        await startCheckout({
          checkoutType: 'subscription',
          planTier: 'pro',
          ...(priceId ? { priceId } : {}),
        })
      }
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
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('subtitle1')}
            <br />
            {t('subtitle2')}
          </p>

          {/* 月付/年付切换 */}
          <div className="mt-10 inline-flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                billing === 'monthly' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('billingMonthly')}
            </button>
            <button
              type="button"
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                billing === 'annual' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('billingAnnual')}
              <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-xs text-indigo-300">
                {t('billingSave')}
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
            const featureKeys = Array.from({ length: product.featuresCount }, (_, i) => i)
            const features = t.raw(`${product.id}.features`) as string[]

            let priceNote: string
            if (product.id === 'free') priceNote = t('forever')
            else if (product.id === 'pro')
              priceNote =
                billing === 'annual'
                  ? t('annualNote', { price: product.annualTotalDisplay ?? '' })
                  : t('monthlyNote')
            else priceNote = t('oneTimeNote')

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
                    {t('popular')}
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white mb-1">{t(`${product.id}.name`)}</h2>
                  <p className="text-xs text-slate-500 mb-4">{t(`${product.id}.tagline`)}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">{displayPrice}</span>
                    {isSubscription && product.id !== 'free' && billing === 'monthly' && (
                      <span className="text-slate-500 text-sm mb-1">{t('perMonth')}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{priceNote}</p>
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                  {featureKeys.map((i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="mt-0.5 text-indigo-400 flex-shrink-0">✓</span>
                      <span>{features[i]}</span>
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
                  {checkingOut === product.id ? '…' : t(`${product.id}.cta`)}
                </button>
              </div>
            )
          })}
        </div>

        {/* Commercial / Self-hosted */}
        <div className="mb-24 rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium mb-2">
                {t('commercialEyebrow')}
              </p>
              <h3 className="text-lg font-semibold text-white mb-2">{t('commercialTitle')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                {t('commercialBody')}
              </p>
            </div>
            <a
              href="mailto:hello@tribox.md?subject=Commercial%20License%20Inquiry"
              className="flex-shrink-0 rounded-xl border border-white/20 hover:border-white/40 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white transition-colors whitespace-nowrap"
            >
              {t('commercialCta')}
            </a>
          </div>
        </div>

        {/* 功能对比 */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold text-white text-center mb-3 tracking-tight">
            {t('comparisonTitle')}
          </h2>
          <p className="text-slate-500 text-center text-sm mb-10">{t('comparisonSubtitle')}</p>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-6 text-left text-slate-400 font-medium w-1/2">
                    {t('comparison.headerFeature')}
                  </th>
                  <th className="py-4 px-4 text-center text-slate-300 font-semibold">tribox</th>
                  <th className="py-4 px-4 text-center text-indigo-300 font-semibold">Pro</th>
                  <th className="py-4 px-4 text-center text-slate-300 font-semibold">AI credits</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                  >
                    <td className="py-3.5 px-6 text-slate-300">{row.label}</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">{row.free}</td>
                    <td className="py-3.5 px-4 text-center text-indigo-300 font-medium">
                      {row.pro}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-300">{row.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-white text-center mb-10 tracking-tight">
            {t('faqTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-12">
            {t('faqContact')}{' '}
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
