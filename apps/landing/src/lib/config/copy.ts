import { FooterItem } from '@/components/footer'
import { env } from '@/env'
import { NumberedCard } from '@/components/numbered-card'
import { ElementType, ReactNode } from 'react'
import { PortfolioLineGraph } from '@/components/portfolio-line-graph'
import { NotificationList } from '@/components/notification-list'
import { LegalFiles } from '@/components/legal-files'
import { PaymentHandlingFlow } from '@/components/payment-handling-flow'

/**
 * Contains all of the copy written for services section of the landing page.
 */
const services: NumberedCard[] = [
  {
    title: 'Marketplace',
    description:
      'List or find investment opportunities on our rich marketplace - completely free of charge for everyone.',
  },
  {
    title: 'Express Equity Crowdfunding',
    description:
      'Run and participate in a crowdfunding campaign without all of the hassle. We take care of all the legal, compliance, and payment processing. Campaigns can be run privately or publicly on our marketplace.',
  },
  {
    title: 'Out of the Box Share Issuance',
    description:
      'Distribute shares on our platform with a few clicks. We provide a seamless experience for both issuers and investors.',
  },
  {
    title: 'Transaction Management',
    description:
      'Let us handle the entire process of raising capital from start to finish. You can raise capital as easily as sending a link to your future investors!',
  },
  {
    title: 'Due Diligence & Compliance',
    description:
      'Easily manage your due diligence and compliance requirements. We help you craft a comprehensive due diligence package that is tailored to your business.',
  },
  {
    title: 'Mix & Match',
    description:
      'We provide a range of services to help you achieve your goals. You can mix and match the services you need to fit your business needs.',
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
    title: 'Crowdfunding',
    description:
      'A marketplace for businesses to raise capital and explore investment opportunities. From private to public offerings, we have you covered.',
    element: PortfolioLineGraph,
  },
  {
    title: 'Fast Compliance',
    description:
      'We make compliance, due diligence, and all the other headaches of raising capital easy - finish transactions in minutes.',
    // element: <NotificationList className="h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    element: NotificationList,
  },
  {
    title: 'Seamless Share Distribution',
    description:
      'Issuing and buying shares is now easy. We handle all the legal aspects, ensuring both parties are protected.',
    element: LegalFiles,
  },
  {
    title: 'Payment Processing',
    description:
      'Out of the box transaction processing. We seamlessly deal with all purchases and payments, letting you focus on the important stuff.',
    element: PaymentHandlingFlow,
  },
]


/**
 * Contains all of the copy written for the landing page.
 */
const landing = {
  hero,
  footer: footerLinks,
  services,
  features,
}

/**
 * Contains all of the copy written for the app.
 */
export const copy = {
  landing,
}
