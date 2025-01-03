import { cn } from '@repo/ui/lib/utils'
import { Input } from '@repo/ui/components/input'
import { Button } from '@repo/ui/components/button'
import { Mail } from 'lucide-react'
import { ComponentPropsWithoutRef, FC } from 'react'
import { Section, Container, Box } from '@/components/layout'
import { NewsletterSubscribeForm } from '@/components/newsletter-subscribe-form'

export const Newsletter: FC<ComponentPropsWithoutRef<'section'>> = ({
  className,
  ...props
}) => {
  return (
    <Section className={cn(className)} {...props}>
      <Container>
        <Box
          cols={{ lg: 2 }}
          className="relative items-start gap-6 px-6 py-12 rounded-lg sm:px-8 bg-secondary"
        >
          <div className="flex flex-col items-start gap-4 md:flex-row">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-foreground">
              <Mail className="w-6 h-6 text-background" />
            </div>
            <div className="flex flex-col items-start gap-2">
              <h2 className="font-sans text-3xl font-medium text-left">
                Keep up with the latest
              </h2>
              <p className="text-muted-foreground">
                Subscribe to our newsletter to get the latest Fundlevel news.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="hidden text-sm font-medium text-gray-600 dark:text-gray-300 lg:block">
              Subscribe to our newsletter
            </h3>
            <NewsletterSubscribeForm className="flex flex-row gap-2 w-full" />
          </div>
        </Box>
      </Container>
    </Section>
  )
}
