import { XIcon } from '@repo/ui/icons'
import { Linkedin } from 'lucide-react'
import { ElementType } from 'react'

type Social = {
  label: string
  link: string
  icon: ElementType
}

/**
 * Configuration for all social media links for the app.
 */
const socials: Social[] = [
  {
    label: 'X',
    link: 'https://x.com/fundlevel',
    icon: XIcon,
  },
  {
    label: 'LinkedIn',
    link: 'https://linkedin.com/company/fundlevel',
    icon: Linkedin,
  },
]

/**
 * Configuration for all contact information for the app.
 */
export const contact = {
  email: 'admin@fundlevel.app',
  calendly: 'https://calendly.com/fundlevel/30min',
  socials,
}

/**
 * Configuration for all business information for the app.
 */
export const business = {
  name: 'Fundlevel',
  copyright: '© 2024 Fundlevel. All rights reserved.',
}
