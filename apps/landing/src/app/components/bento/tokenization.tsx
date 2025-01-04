'use client'

import { useEffect, useMemo, useState } from 'react'
import Balancer from 'react-wrap-balancer'

export const Tokenization = () => {
  const DURATION = 7
  const [randomData, setRandomData] = useState({
    hexValues: Array(120).fill('00'),
    starPositions: Array(50).fill({
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      duration: 4,
      opacity: 0.5,
    }),
  })

  useEffect(() => {
    // Generate random values only on the client side
    setRandomData({
      hexValues: Array.from({ length: 120 }, () =>
        Math.random().toString(16).slice(2, 4)
      ),
      starPositions: Array.from({ length: 50 }, () => ({
        startX: Math.random() * -50,
        startY: Math.random() * 105 + 15,
        endX: Math.random() * -50,
        endY: Math.min(120, Math.max(15, Math.random() * 105 + 15)),
        duration: Math.random() * 2 + 4,
        opacity: Math.random() * 0.5 + 0.5,
      })),
    })
  }, [])

  return (
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
            <linearGradient id="gradient-tokenize" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(6 182 212 / 0)" />
              <stop offset="50%" stopColor="rgb(6 182 212)" />
              <stop offset="100%" stopColor="rgb(6 182 212 / 0)" />
            </linearGradient>
            <linearGradient id="star-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="10%" stopColor="#fff04c" />
              <stop offset="100%" stopColor="#ff9f3c" />
            </linearGradient>
          </defs>

          <g mask="url(#mask-doc1)" className="text-muted-foreground/20">
            {Array.from({ length: 8 }).map((_, index) => (
              <g key={`doc1-${index}`} transform={`translate(${index * 85} 0)`}>
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
              <g key={`doc2-${index}`} transform={`translate(${index * 85} 0)`}>
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
                          {randomData.hexValues[i]}
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
            {randomData.starPositions.map((pos, i) => {
              return (
                <circle
                  key={`star-${i}`}
                  r="1"
                  cx={pos.startX}
                  cy={pos.startY}
                  fill="url(#star-gradient)"
                >
                  <animate
                    attributeName="cx"
                    values={`${pos.startX}; ${pos.endX}; ${pos.startX}`}
                    dur={`${pos.duration}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${pos.startY}; ${pos.endY}; ${pos.startY}`}
                    dur={`${pos.duration}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values={`${pos.opacity}; 0.8`}
                    dur={`${pos.duration}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="1; 2; 0"
                    dur={`${pos.duration}s`}
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
            Transform contracts into digital tokens for enhanced security and
            efficiency.
          </Balancer>
        </p>
      </div>
    </div>
  )
}
