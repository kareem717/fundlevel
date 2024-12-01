import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { ComponentPropsWithoutRef, FC } from 'react'
import { Section, Container, Box } from '@/components/layout'

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
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                className="text-black bg-gray-100 border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <Button className="px-8 text-white bg-indigo-600 hover:bg-indigo-700">
                Subscribe
              </Button>
            </div>
          </div>
        </Box>
      </Container>
    </Section>
  )
}
