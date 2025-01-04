'use client'

import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import React, { ComponentPropsWithoutRef, FC, useState } from 'react'
import { Section, Box, Container } from '@/app/components/layout'
import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer'

const items = [
  {
    header: 'Invest',
    subheading: 'Discover high growth investments.',
    description:
      'Access a range of shariah-compliant models, from revenue sharing to asset leasing, and grow your portfolio.',
    buttonText: 'Learn More',
    image:
      'https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fproduct-selector%2Fproduct-selector-card-desktop.png&w=828&q=75',
    url: '/invest',
  },
  {
    header: 'Raise',
    subheading: 'Secure capital without debt or interest.',
    description:
      'Connect with investors through equity crowdfunding, profit-sharing, and more. Grow your business ethically and efficiently.',
    buttonText: 'Get Started',
    image:
      'https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fproduct-selector%2Fproduct-selector-capital-desktop.png&w=828&q=75',
    url: '/raise',
  },
]

export const CTA: FC<ComponentPropsWithoutRef<'section'>> = ({
  className,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const duration = 0.5

  return (
    <Section className={cn(className)} {...props}>
      <Container>
        <Box
          direction="col"
          className="items-center justify-center gap-4 text-center"
        >
          <p className="text-sm tracking-wide text-muted-foreground">
            JOIN FUNDLEVEL
          </p>
          <h2 className="text-4xl tracking-tight md:text-5xl">
            Invest & Raise Capital With Confidence
          </h2>
        </Box>
        <Box
          className="justify-center gap-4"
          direction={{ sm: 'col', md: 'row' }}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                'relative overflow-hidden rounded-2xl bg-secondary'
              )}
              animate={{
                width: activeIndex === index ? '100%' : '66.666667%',
              }}
              transition={{
                duration,
                ease: 'easeInOut',
              }}
              initial={{
                width: activeIndex === index ? '66.666667%' : '100%',
              }}
            >
              {/* Content */}
              <motion.div
                className={cn(
                  'relative z-10 p-8 md:p-12 flex flex-col h-full min-h-[500px]'
                )}
                animate={{
                  width: activeIndex === index ? '66.666667%' : '100%',
                }}
                transition={{
                  duration,
                  ease: 'easeInOut',
                }}
                initial={{
                  width: activeIndex === index ? '66.666667%' : '100%',
                }}
              >
                <div className="flex flex-col gap-2">
                  <ArrowUpRight
                    className={cn(
                      'p-1 bg-foreground text-background rounded-md transition-all duration-500',
                      activeIndex === index ? 'w-10 h-10' : 'w-8 h-8'
                    )}
                  />
                  <motion.h3
                    className={cn(
                      'font-medium mt-8 text-4xl',
                      activeIndex === index && 'mb-0'
                    )}
                    animate={{
                      fontSize: activeIndex === index ? '3rem' : '2.25rem',
                    }}
                    transition={{
                      duration,
                      ease: 'easeInOut',
                    }}
                    initial={{
                      fontSize: '2.25rem',
                    }}
                  >
                    {item.header}
                  </motion.h3>
                </div>
                <motion.div
                  className={cn(
                    'relative flex flex-col gap-8 py-4 my-4',
                    activeIndex === index ? 'w-2/3' : 'w-full'
                  )}
                  animate={{
                    width: activeIndex === index ? '66.666667%' : '100%',
                  }}
                  transition={{
                    duration,
                    ease: 'easeInOut',
                  }}
                >
                  <motion.p
                    className="text-xl md:text-2xl"
                    animate={{
                      y: activeIndex === index ? 4 : 96,
                    }}
                    transition={{ duration, ease: 'easeInOut' }}
                  >
                    <Balancer>{item.subheading}</Balancer>
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 60 }}
                    animate={{
                      opacity: activeIndex === index ? 1 : 0,
                      y: activeIndex === index ? 0 : 60,
                    }}
                    transition={{
                      duration,
                      ease: 'easeInOut',
                    }}
                    className="absolute text-muted-foreground top-full"
                  >
                    <Balancer>{item.description}</Balancer>
                  </motion.p>
                </motion.div>
                {/* <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="bg-[#4F5DFF] hover:bg-[#4F5DFF]/90 text-white"
                  >
                    {item.buttonText}
                  </Button>
                </div> */}
              </motion.div>

              {/* Image */}
              <motion.div
                className={cn(
                  'absolute top-0 right-0 h-full overflow-hidden'
                )}
                animate={{
                  width: activeIndex === index ? '33.333333%' : '0%',
                }}
                transition={{
                  duration,
                  ease: 'easeInOut',
                }}
                initial={{
                  width: activeIndex === index ? '33.333333%' : '0%',
                }}
              >
                <div className="w-full h-full overflow-hidden rounded-r-lg bg-foreground">
                  {/* <Image
                    src={item.image}
                    alt={`${item.header} interface`}
                    width={800}
                    height={1200}
                    className="object-cover w-full h-full"
                  /> */}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Section>
    // <section className={cn("py-24 px-4", className)} {...props}>
    //   <div className="">
    //     <div className="mb-16 text-center">

    //     </div>

    //     <div className="group flex max-md:flex-col justify-center gap-2 w-[80%] mx-auto mb-10 mt-3">

    //     </div>
    //   </div>
    // </section>
  )
}
