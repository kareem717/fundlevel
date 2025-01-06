import Link from 'next/link'
import { cn } from '@repo/ui/lib/utils'
import { ComponentPropsWithoutRef, FC } from 'react'
import { contact } from '@/lib/config'
import { Separator } from '@repo/ui/components/separator'
import { LogoDiv } from '@/components/logo-div'

export type FooterItem = {
  title: string;
  links: { title: string; href: string }[];
}

export interface FooterProps extends ComponentPropsWithoutRef<'footer'> {
  footerLinks: FooterItem[];
}

export const Footer: FC<FooterProps> = ({
  className,
  footerLinks,
  ...props
}) => {
  return (
    <footer className={cn('w-full pb-6 rounded-lg text-card-foreground p-6 shadow-2xl bg-secondary flex flex-col', className)} {...props}>
      <div className="flex flex-col justify-center lg:flex-row md:justify-start gap-12 xl:gap-40">
        <LogoDiv className="w-48 md:w-64" />
        <div className="flex flex-wrap justify-start gap-16 w-full">
          {footerLinks.map((section) => (
            <div
              key={section.title}
              className="block flex-1 basis-0 flex-col gap-2"
            >
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                {section.title}
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="hover:underline"
                      aria-label={link.title}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Separator className="my-6 bg-muted-foreground" />
      <div className="flex justify-between items-center w-full">
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
              <social.icon className="size-5" />
              <span className="sr-only">{social.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
