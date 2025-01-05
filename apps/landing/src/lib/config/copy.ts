import { FooterItem } from '@/app/components/footer'
import { CTA } from '@/app/components/cta-card'
import { env } from '@/env'
import { NumberedCard } from '@/app/components/numbered-card'

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

/**
 * Contains all of the copy written for the landing page.
 */
const landing = {
  hero: {
    meetingCTA: 'Book meeting',
    newsletter: {
      CTA: 'Newsletter',
      signUpURL: env.NEXT_PUBLIC_NEWS_LETTER_SIGN_UP_URL,
    },
  },
  footer: footerLinks,
  ctas,
  models,
}

/**
 * Contains all of the copy written for the app.
 */
export const copy = {
  landing,
}
