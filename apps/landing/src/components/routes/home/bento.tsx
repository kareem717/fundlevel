'use client'

import { Box, Container, Section } from '@/components/layout'
import { LampContainer } from '@/components/ui/lamp'
import {
  Spotlight,
  SpotlightCard,
  SpotLightItem,
} from '@/components/ui/spotlight'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { FC, ComponentPropsWithoutRef, useMemo } from 'react'
import { CardDemo, Sparkles } from './bento/token-card'
import { SparklesCore } from '@/components/ui/sparkles'
import { EvervaultCard } from '@/components/ui/evervault-card'
import { Marquee } from '@/components/ui/marquee'
import { AnimatedListDemo } from './bento/notification'
import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer'
import { Graph2 } from './bento/graph'
import { Cell } from 'recharts'
import { Pie } from 'recharts'
import { PieChart } from 'recharts'
import { ResponsiveContainer } from 'recharts'

const DURATION = 7

const files = [
  {
    name: 'bitcoin.pdf',
    body: 'Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.',
  },
  {
    name: 'finances.xlsx',
    body: 'A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.',
  },
  {
    name: 'logo.svg',
    body: 'Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.',
  },
  {
    name: 'keys.gpg',
    body: 'GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.',
  },
  {
    name: 'seed.txt',
    body: 'A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.',
  },
]

export const BentoFeatures: FC<ComponentPropsWithoutRef<'section'>> = ({
  className,
  ...props
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const colSpans = {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    4: 'lg:col-span-4',
  }

  const rowSpans = {
    1: 'lg:row-span-1',
    2: 'lg:row-span-2',
    4: 'lg:row-span-4',
  }

  const bentoItems = useMemo(
    () => [
      {
        id: 1,
        title: 'Wallet',
        color: 'bg-secondary',
        element: (
          <div className="flex flex-col justify-around h-full p-2 overflow-hidden group">
            <div className="relative flex items-center justify-center scale-[0.8] [mask-image:linear-gradient(to_top,transparent_5%,#000_100%)]">
              <svg
                width="200"
                height="200"
                viewBox="0 0 24 24"
                className="transition-transform duration-700 transform group-hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
                }}
              >
                <path
                  fill="rgb(34, 211, 238, 0.8)"
                  d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                />
              </svg>
            </div>
            <div className="relative z-10">
              <h3 className="mb-2 text-xl font-medium tracking-tight">
                Wallet
              </h3>
              <p className="text-muted-foreground">
                <Balancer>
                  A centralized hub to manage all your assets seamlessly.
                </Balancer>
              </p>
            </div>
          </div>
        ),
        width: 1,
        height: 2,
      },
      {
        id: 2,
        title: 'Portfolios™',
        color: 'bg-secondary',
        element: (
          <div className="flex flex-col justify-around h-full p-2 group">
            <div className="h-[200px] mb-4 [mask-image:linear-gradient(to_top,transparent_5%,#000_100%)] transition-transform duration-700 transform group-hover:scale-110">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Private Equity', value: 40 },
                      { name: 'Venture', value: 30 },
                      { name: 'Crypto', value: 30 },
                      { name: 'Other', value: 10 },
                    ]}
                    stroke="none"
                    className="pointer-events-none"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="rgb(34, 211, 238, 0.8)" />
                    <Cell fill="rgb(251, 146, 60, 0.8)" />
                    <Cell fill="rgb(34, 211, 238, 0.8)" />
                    <Cell fill="rgb(251, 146, 60, 0.8)" />
                    <Cell fill="rgb(34, 211, 238, 0.8)" />
                    <Cell fill="rgb(251, 146, 60, 0.8)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <h3 className="mb-2 text-xl font-medium tracking-tight">
              Portfolios™
            </h3>
            <p className="text-muted-foreground">
              Professionally managed funds, including private equity, venture,
              and crypto, where you can invest with confidence.
            </p>
          </div>
        ),
        width: 1,
        height: 2,
      },
      {
        id: 3,
        title: 'Numbers™',
        color: 'bg-secondary',
        element: (
          <div className="relative flex flex-col justify-around h-full p-2 overflow-hidden group">
            <Graph2 />

            <div className="relative z-10">
              <h3 className="mb-2 text-xl font-medium tracking-tight">
                Numbers™
              </h3>
              <p className="text-base font-medium leading-relaxed text-muted-foreground/90">
                A comprehensive suite of tools for businesses to analyze
                activities and assess overall business health.
              </p>
            </div>
          </div>
        ),
        width: 2,
        height: 2,
      },
      {
        id: 4,
        title: 'Clarity™',
        color: 'bg-secondary',
        element: (
          <div className="flex flex-col justify-end h-full p-2 overflow-hidden group">
            <AnimatedListDemo className="absolute right-0 top-0 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />

            <div className="relative z-10">
              <h3 className="mb-2 text-2xl font-medium tracking-tight">
                Clarity™
              </h3>
              <p className="text-base font-medium leading-relaxed text-muted-foreground/90">
                Our proprietary stack for investment and risk analysis,
                providing unparalleled insights and transparency.
              </p>
            </div>
          </div>
        ),
        width: 2,
        height: 2,
      },
      {
        id: 5,
        title: 'Legal',
        color: 'bg-secondary',
        element: (
          <div className="flex flex-col justify-around h-full p-2 overflow-hidden group">
            <div className="relative h-full">
              <Marquee className="absolute top-0 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] ">
                {files.map((f, idx) => (
                  <figure
                    key={idx}
                    className={cn(
                      'relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4',
                      'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
                      'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
                      'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none'
                    )}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex flex-col">
                        <figcaption className="text-sm font-medium dark:text-white ">
                          {f.name}
                        </figcaption>
                      </div>
                    </div>
                    <blockquote className="mt-2 text-xs">{f.body}</blockquote>
                  </figure>
                ))}
              </Marquee>
            </div>

            <div className="relative">
              <h3 className="flex items-center gap-2 text-xl font-medium tracking-tight">
                Legal
                <span className="inline-block animate-pulse">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="rgb(251 146 60 / 0.8)"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                </span>
              </h3>
              <p className="mt-2 text-muted-foreground">
                <Balancer>
                  Comprehensive handling of all legal aspects, ensuring
                  compliance and peace of mind.
                </Balancer>
              </p>
            </div>
          </div>
        ),
        width: 1,
        height: 2,
      },
      {
        id: 6,
        title: 'Tokenization',
        color: 'bg-secondary',
        element: (
          <div className="flex flex-col justify-around h-full p-2 overflow-hidden group">
            <div className="relative flex items-center justify-center w-full min-h-[130px] h-full dark:[mask-image:linear-gradient(to_top,transparent_5%,#000_100%)]">
              <svg
                width="100%"
                height="135"
                viewBox="0 0 100% 135"
                fill="none"
                className="absolute w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <mask id={`mask-doc1`}>
                    <rect width="100%" height="135" fill="black" />
                    <rect x="0" y="0" width="100%" height="135" fill="white">
                      <animate
                        attributeName="x"
                        from="0"
                        to="100%"
                        dur={`${DURATION}s`}
                        repeatCount="indefinite"
                      />
                    </rect>
                  </mask>
                  <mask id={`mask-doc2`}>
                    <rect x="0" y="0" width="100%" height="135" fill="white" />
                    <rect width="100%" height="135" fill="black">
                      <animate
                        attributeName="x"
                        from="0"
                        to="100%"
                        dur={`${DURATION}s`}
                        repeatCount="indefinite"
                      />
                    </rect>
                  </mask>
                  <linearGradient
                    id="gradient-tokenize"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="rgb(6 182 212 / 0)" />
                    <stop offset="50%" stopColor="rgb(6 182 212)" />
                    <stop offset="100%" stopColor="rgb(6 182 212 / 0)" />
                  </linearGradient>
                  <linearGradient
                    id="star-gradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="10%" stopColor="#fff04c" />
                    <stop offset="100%" stopColor="#ff9f3c" />
                  </linearGradient>
                </defs>

                <g mask="url(#mask-doc1)" className="text-muted-foreground/20">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <g
                      key={`doc1-${index}`}
                      transform={`translate(${index * 85} 0)`}
                    >
                      <path
                        d="M10 10 H65 L75 20 V120 H10 V10"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M65 10 L65 20 H75 L65 10"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="20"
                        y1="50"
                        x2="65"
                        y2="50"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="20"
                        y1="70"
                        x2="55"
                        y2="70"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="20"
                        y1="90"
                        x2="45"
                        y2="90"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </g>
                  ))}
                </g>

                <g mask="url(#mask-doc2)">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <g
                      key={`doc2-${index}`}
                      transform={`translate(${index * 85} 0)`}
                    >
                      <text className="text-[8px]">
                        {Array.from({ length: 100 }).map((_, i) => {
                          const x = 10 + (i % 6) * 11
                          const y = 20 + Math.floor(i / 6) * 11
                          if (
                            y <= 120 &&
                            (x <= 65 || y >= 30) &&
                            !(x >= 65 && y <= 30)
                          ) {
                            return (
                              <tspan
                                key={i}
                                x={x}
                                y={y}
                                fill={
                                  i % 2 === 0
                                    ? 'rgb(34, 211, 238, 0.8)'
                                    : 'rgb(251, 146, 60, 0.8)'
                                }
                              >
                                {Math.random().toString(16).slice(2, 4)}
                              </tspan>
                            )
                          }
                          return null
                        })}
                      </text>
                    </g>
                  ))}
                </g>

                <g className="animate-slide-full">
                  {[...Array(50)].map((_, i) => {
                    const startX = Math.random() * -50
                    const startY = Math.random() * 105 + 15
                    const endX = Math.random() * -50 // Different random position within same bounds
                    const endY = Math.min(
                      120,
                      Math.max(15, Math.random() * 105 + 15)
                    ) // Keep within 15-120 bounds
                    return (
                      <circle
                        key={`star-${i}`}
                        r="1"
                        cx={startX}
                        cy={startY}
                        fill="url(#star-gradient)"
                      >
                        <animate
                          attributeName="cx"
                          values={`${startX}; ${endX}; ${startX}`}
                          dur={`${Math.random() * 2 + 4}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="cy"
                          values={`${startY}; ${endY}; ${startY}`}
                          dur={`${Math.random() * 2 + 4}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values={`${Math.random() * 0.5 + 0.5}; 0.8`}
                          dur={`${Math.random() * 2 + 4}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="r"
                          values="1; 2; 0"
                          dur={`${Math.random() * 2 + 4}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )
                  })}
                </g>
                <rect width="1.5" height="135" fill="url(#gradient-tokenize)">
                  <animate
                    attributeName="x"
                    from="0"
                    to="100%"
                    dur={`${DURATION}s`}
                    repeatCount="indefinite"
                    id="lineAnimation"
                  />
                </rect>
              </svg>
            </div>

            <div className="relative z-10">
              <h3 className="flex items-center gap-2 text-xl font-medium tracking-tight">
                Tokenization
                <span className="inline-flex animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-orange-400/80 shadow-[0_0_8px_rgba(251,146,60,0.6)]"></div>
                </span>
              </h3>
              <p className="mt-2 text-muted-foreground">
                <Balancer>
                  Transform contracts into digital tokens for enhanced security
                  and efficiency.
                </Balancer>
              </p>
            </div>
          </div>
        ),
        width: 1,
        height: 2,
      },
    ],
    []
  )

  return (
    <Section className={className} {...props}>
      <Container>
        <Box className="items-center justify-center gap-2" direction="col">
          <p className="text-sm tracking-wide text-muted-foreground">
            PLATFORM FEATURES
          </p>
          <h2 className="text-4xl tracking-tight md:text-5xl">
            Powerful Tools & Features
          </h2>
        </Box>
        <Box
          cols={{ sm: 1, md: 2, lg: 4 }}
          rows={{ sm: 4, md: 6, lg: 4 }}
          gap={4}
          className="grid-flow-dense"
        >
          {bentoItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                `${item?.color ?? 'bg-white'} p-4 rounded-lg overflow-hidden min-h-[300px] relative`,
                colSpans[item.width as keyof typeof colSpans],
                isMobile && 'col-span-1 row-span-1/2',
                'md:col-span-2 md:row-span-2' // Added md breakpoint styles
              )}
            >
              {item.element}
            </div>
          ))}
        </Box>
      </Container>
    </Section>
  )
}
