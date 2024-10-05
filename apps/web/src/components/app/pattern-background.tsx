import { ComponentPropsWithoutRef, FC } from 'react'
import { cn } from '@/lib/utils'

// Function to generate a more unique hash based on a string
const hashCode = (str: string) => {
  let hash = 2166136261 // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i) // XOR the byte
    hash *= 16777619 // FNV prime
  }
  return Number(hash & 0xffffffff) // Convert to 32bit integer
}

// Function to generate a random color based on a seed
const getRandomColor = (seed: number) => {
  const hue = seed % 360
  return `hsl(${hue}, 70%, 80%)`
}

const patterns = [
  'diamonds',
  'circles',
  'triangles',
  'squares',
  'hexagons',
  'stars',
  'waves',
  'stripes',
  'dots',
  'crosses',
  'zigzags',
  'checkerboard'
] as const

export type PatternType = typeof patterns[number]

export interface PatternBackgroundProps extends ComponentPropsWithoutRef<"div"> {
  hash: string
  size?: number
}

export const PatternBackground: FC<PatternBackgroundProps> = ({ hash, size = 40, className, ...props }) => {
  const seed = hashCode(hash)
  const randomPattern = patterns[Math.abs(seed) % patterns.length]
  const randomColor = getRandomColor(seed)

  let patternSvg = ''

  switch (randomPattern) {
    case 'diamonds':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 L${size / 2} ${size / 2} L${size} 0 L${size / 2} ${-size / 2} Z" fill="${randomColor}" />
      </svg>`
      break
    case 'circles':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="${randomColor}" />
      </svg>`
      break
    case 'triangles':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 ${size} L${size / 2} 0 L${size} ${size} Z" fill="${randomColor}" />
      </svg>`
      break
    case 'squares':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect x="${size / 4}" y="${size / 4}" width="${size / 2}" height="${size / 2}" fill="${randomColor}" />
      </svg>`
      break
    case 'hexagons':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <polygon points="${size / 2},0 ${size},${size / 4} ${size},${(3 * size) / 4} ${size / 2},${size} 0,${(3 * size) / 4} 0,${size / 4}" fill="${randomColor}" />
      </svg>`
      break
    case 'stars':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <polygon points="${size / 2},0 ${size * 0.6},${size * 0.4} ${size},${size * 0.4} ${size * 0.7},${size * 0.6} ${size * 0.8},${size} ${size / 2},${size * 0.8} ${size * 0.2},${size} ${size * 0.3},${size * 0.6} 0,${size * 0.4} ${size * 0.4},${size * 0.4}" fill="${randomColor}" />
      </svg>`
      break
    case 'waves':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 ${size / 2} C${size / 4} 0, ${size * 3 / 4} ${size}, ${size} ${size / 2} C${size * 3 / 4} ${size}, ${size / 4} 0, 0 ${size / 2}" fill="${randomColor}" />
      </svg>`
      break
    case 'stripes':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size / 5}" fill="${randomColor}" />
        <rect y="${size / 5 * 2}" width="${size}" height="${size / 5}" fill="${randomColor}" />
        <rect y="${size / 5 * 4}" width="${size}" height="${size / 5}" fill="${randomColor}" />
      </svg>`
      break
    case 'dots':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 4}" cy="${size / 4}" r="${size / 10}" fill="${randomColor}" />
        <circle cx="${size * 3 / 4}" cy="${size / 4}" r="${size / 10}" fill="${randomColor}" />
        <circle cx="${size / 4}" cy="${size * 3 / 4}" r="${size / 10}" fill="${randomColor}" />
        <circle cx="${size * 3 / 4}" cy="${size * 3 / 4}" r="${size / 10}" fill="${randomColor}" />
      </svg>`
      break
    case 'crosses':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="0" x2="${size}" y2="${size}" stroke="${randomColor}" strokeWidth="2" />
        <line x1="${size}" y1="0" x2="0" y2="${size}" stroke="${randomColor}" strokeWidth="2" />
      </svg>`
      break
    case 'zigzags':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 ${size / 2} L${size / 4} 0 L${size / 2} ${size / 2} L${size * 3 / 4} 0 L${size} ${size / 2}" stroke="${randomColor}" strokeWidth="2" fill="none" />
      </svg>`
      break
    case 'checkerboard':
      patternSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size / 2}" height="${size / 2}" fill="${randomColor}" />
        <rect x="${size / 2}" y="${size / 2}" width="${size / 2}" height="${size / 2}" fill="${randomColor}" />
      </svg>`
      break
  }

  const encodedPattern = encodeURIComponent(patternSvg)

  return (
    <div
      className={cn("h-24 w-full rounded-t-lg", className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodedPattern}")`,
        backgroundRepeat: 'repeat'
      }}
      {...props}
    />
  )
}