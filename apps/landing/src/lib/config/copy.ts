import { FooterItem } from '@/components/footer'
import { CTA } from '@/components/cta-card'
import { env } from '@/env'
import { NumberedCard } from '@/components/numbered-card'
import { ElementType, ReactNode } from 'react'
import { PortfolioLineGraph } from '@/components/portfolio-line-graph'
import { NotificationList } from '@/components/notification-list'
import { LegalFiles } from '@/components/legal-files'
import { PaymentHandlingFlow } from '@/components/payment-handling-flow'

const models: NumberedCard[] = [
  {
    title: 'Equity Financing',
    description:
      'Empowering investors to own a share of businesses, benefiting from dividends or capital growth.',
  },
  {
    title: 'Revenue/Profit Sharing',
    description:
      'Offering a share of business profits over time, ideal for cash-flow positive ventures.',
  },
  {
    title: 'Asset Funding Arrangements',
    description:
      'Facilitating shared ownership of assets, generating profits from their use.',
  },
  {
    title: 'Mergers & Acquisitions',
    description:
      'Streamlining business growth and consolidation through strategic partnerships and acquisitions.',
  },
]

/**
 * Contains all of links that are displayed in the footer on the landing page.
 */
const footerLinks: FooterItem[] = [
  {
    title: 'Quick Links',
    links: [
      { title: 'About', href: '/about' },
      { title: 'Contact', href: '/contact' },
      { title: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'Blog', href: '/blog' },
      { title: 'FAQs', href: '/faqs' },
      { title: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Fundlevel Apps',
    links: [
      { title: 'For Investors', href: '/investors' },
      { title: 'For Businesses', href: '/businesses' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { title: 'Investment Terms', href: '/legal/investment-terms' },
      { title: 'Business Agreement', href: '/legal/business-agreement' },
      { title: 'Privacy Policy', href: '/legal/privacy-policy' },
    ],
  },
]

/**
 * Contains all of the copy written for CTA cards section on the landing page.
 */
const ctas: CTA[] = [
  {
    header: 'Invest',
    subheading: 'Discover high growth investments.',
    description:
      'Access a range of shariah-compliant models, from revenue sharing to asset leasing, and grow your portfolio.',
  },
  {
    header: 'Raise',
    subheading: 'Secure capital without debt or interest.',
    description:
      'Connect with investors through equity crowdfunding, profit-sharing, and more. Grow your business ethically and efficiently.',
  },
]

const hero = {
  meetingCTA: 'Book meeting',
  newsletter: {
    CTA: 'Newsletter',
    signUpURL: env.NEXT_PUBLIC_NEWS_LETTER_SIGN_UP_URL,
  },
  title: 'Simple Alternative Investing Aligned With Your Values',
  description:
    'Fundlevel enables access to alternative and private markets, allowing investors to find high-return opportunities and businesses to raise capital in a healthy, growth-conducive manner — all while maintaining shariah compliance.',
}

export type Feature = {
  title: string
  description: string
  element: ElementType
}

const features: Feature[] = [
  {
    title: 'Numbers™',
    description:
      'A comprehensive suite of tools for businesses to analyze activities and assess overall business health.',
    element: PortfolioLineGraph,
  },
  {
    title: 'Clarity™',
    description:
      'Our proprietary stack for investment and risk analysis, providing unparalleled insights and transparency.',
    // element: <NotificationList className="h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    element: NotificationList,
  },
  {
    title: 'Legal',
    description:
      'Comprehensive handling of all legal aspects, ensuring compliance and peace of mind.',
    element: LegalFiles,
  },
  {
    title: 'Integrations',
    description:
      'Comprehensive handling of all legal aspects, ensuring compliance and peace of mind.',
    element: PaymentHandlingFlow,
  },
]

/**
 * Contains all of the copy written for the landing page.
 */
const landing = {
  hero,
  footer: footerLinks,
  ctas,
  models,
  features,
}

/**
 * Contains all of the copy written for the app.
 */
export const copy = {
  landing,
}
