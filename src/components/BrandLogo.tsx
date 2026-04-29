'use client'

import React from 'react'

type BrandLogoVariant = 'primary' | 'stacked' | 'mark'
type BrandLogoScheme = 'default' | 'mono' | 'inverse'

type BrandLogoProps = {
  variant?: BrandLogoVariant
  scheme?: BrandLogoScheme
  className?: string
  title?: string
}

const displayFont = "'Cormorant Garamond', Georgia, serif"
const sansFont = "'Manrope', 'Helvetica Neue', Arial, sans-serif"

const schemes: Record<BrandLogoScheme, { primary: string; secondary: string; accent: string; frame: string }> = {
  default: {
    primary: '#1E3A5F',
    secondary: '#2D3138',
    accent: '#7E8996',
    frame: '#CAD1D8',
  },
  mono: {
    primary: '#2D3138',
    secondary: '#2D3138',
    accent: '#7E8996',
    frame: '#B7BCC3',
  },
  inverse: {
    primary: '#F7F1E6',
    secondary: '#F7F1E6',
    accent: '#D0D7E0',
    frame: '#8EA2BA',
  },
}

function PrimaryLogo({ colors }: { colors: { primary: string; secondary: string; accent: string; frame: string } }) {
  return (
    <svg viewBox="0 0 460 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(4 13)">
        <path d="M16 34L40 12L64 34" stroke={colors.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 34H56" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
        <path d="M44 15V5" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
        <rect x="8" y="8" width="64" height="64" rx="18" stroke={colors.frame} strokeWidth="1.5" />
        <text
          x="40"
          y="58"
          textAnchor="middle"
          fill={colors.primary}
          fontFamily={displayFont}
          fontSize="39"
          fontStyle="italic"
          fontWeight="700"
        >
          J
        </text>
      </g>
      <text
        x="92"
        y="42"
        fill={colors.primary}
        fontFamily={displayFont}
        fontSize="46"
        fontStyle="italic"
        fontWeight="700"
        letterSpacing="0.8"
      >
        JEN
      </text>
      <path d="M96 50C142 60 182 62 236 58" stroke={colors.accent} strokeWidth="1.6" strokeLinecap="round" />
      <text
        x="96"
        y="73"
        fill={colors.secondary}
        fontFamily={sansFont}
        fontSize="13"
        fontWeight="700"
        letterSpacing="4.6"
      >
        REMODELING INC
      </text>
    </svg>
  )
}

function StackedLogo({ colors }: { colors: { primary: string; secondary: string; accent: string; frame: string } }) {
  return (
    <svg viewBox="0 0 270 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(99 14)">
        <path d="M18 36L36 18L54 36" stroke={colors.primary} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 37H49" stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M39 18V9" stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round" />
        <rect x="0.75" y="0.75" width="70.5" height="70.5" rx="18" stroke={colors.frame} strokeWidth="1.5" />
        <text
          x="36"
          y="56"
          textAnchor="middle"
          fill={colors.primary}
          fontFamily={displayFont}
          fontSize="42"
          fontStyle="italic"
          fontWeight="700"
        >
          J
        </text>
      </g>
      <text
        x="135"
        y="132"
        textAnchor="middle"
        fill={colors.primary}
        fontFamily={displayFont}
        fontSize="58"
        fontStyle="italic"
        fontWeight="700"
        letterSpacing="1"
      >
        JEN
      </text>
      <path d="M66 145C100 158 141 160 202 149" stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round" />
      <text
        x="135"
        y="178"
        textAnchor="middle"
        fill={colors.secondary}
        fontFamily={sansFont}
        fontSize="15"
        fontWeight="700"
        letterSpacing="5.2"
      >
        REMODELING INC
      </text>
    </svg>
  )
}

function MarkLogo({ colors }: { colors: { primary: string; secondary: string; accent: string; frame: string } }) {
  return (
    <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4.75" y="4.75" width="78.5" height="78.5" rx="22" stroke={colors.frame} strokeWidth="1.5" />
      <path d="M22 39L44 18L66 39" stroke={colors.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29 39H59" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
      <path d="M48 18V9" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
      <text
        x="44"
        y="64"
        textAnchor="middle"
        fill={colors.primary}
        fontFamily={displayFont}
        fontSize="42"
        fontStyle="italic"
        fontWeight="700"
      >
        J
      </text>
    </svg>
  )
}

export default function BrandLogo({
  variant = 'primary',
  scheme = 'default',
  className,
  title = 'JEN Remodeling Inc',
}: BrandLogoProps) {
  const colors = schemes[scheme]

  const content = variant === 'stacked'
    ? <StackedLogo colors={colors} />
    : variant === 'mark'
      ? <MarkLogo colors={colors} />
      : <PrimaryLogo colors={colors} />

  return (
    <div className={className} aria-label={title} role="img">
      {content}
    </div>
  )
}
