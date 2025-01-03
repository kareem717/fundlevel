import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef, createElement, FC } from 'react'
import { Icons } from '@/components/icons'
import { contact } from '@/lib/config'
import { NewsletterSubscribeForm } from '../newsletter-subscribe-form'

const footerLinks: { title: string; links: { title: string; href: string }[] }[] = [
  // {
  //   title: 'Quick Links',
  //   links: [
  //     { title: 'About', href: '/about' },
  //     { title: 'Contact', href: '/contact' },
  //     { title: 'Support', href: '/support' },
  //   ],
  // },
  // {
  //   title: 'Resources',
  //   links: [
  //     { title: 'Blog', href: '/blog' },
  //     { title: 'FAQs', href: '/faqs' },
  //     { title: 'Changelog', href: '/changelog' },
  //   ],
  // },
  // {
  //   title: 'Fundlevel Apps',
  //   links: [
  //     { title: 'For Investors', href: '/investors' },
  //     { title: 'For Businesses', href: '/businesses' },
  //   ],
  // },
  // {
  //   title: 'Legal',
  //   links: [
  //     { title: 'Investment Terms', href: '/legal/investment-terms' },
  //     { title: 'Business Agreement', href: '/legal/business-agreement' },
  //     { title: 'Privacy Policy', href: '/legal/privacy-policy' },
  //   ],
  // },
]

export const Footer: FC<ComponentPropsWithoutRef<'footer'>> = ({
  className,
  ...props
}) => {
  return (
    <footer className={cn('w-full px-6 pb-6', className)} {...props}>
      <div className="rounded-lg text-card-foreground p-6 shadow-2xl bg-secondary flex flex-col">
        <div className="flex flex-col md:flex-row justify-between gap-8 px-6 pb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sign up for updates</h3>
            <p>
              Fundlevel is your one stop shop for tech, business, and finance
              news you need to know.
            </p>
            <NewsletterSubscribeForm className="flex flex-row gap-2 w-full" />
          </div>
          <div className="flex justify-start flex-wrap gap-4 break-words">
            {footerLinks.map((section) => (
              <div
                key={section.title}
                className="block flex-1 basis-0 flex-col gap-2 min-w-32"
              >
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link href={link.href} className="hover:underline">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-muted-foreground flex justify-between items-center pt-6 w-full">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fundlevel. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {contact.socials.map((social, index) => (
              <Link
                key={index}
                href={social.link}
                className="text-muted-foreground hover:text-black"
              >
                {createElement(Icons[social.icon as keyof typeof Icons], {
                  className: 'h-5 w-5',
                })}
                <span className="sr-only">{social.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
