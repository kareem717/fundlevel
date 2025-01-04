import { FooterItem } from '@/app/components/footer'
import { env } from '@/env'

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
}

/**
 * Contains all of the copy written for the app.
 */
export const copy = {
  landing,
}
