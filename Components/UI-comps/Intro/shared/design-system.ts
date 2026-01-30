/**
 * ============================================================================
 * ARCHIVAL DESIGN SYSTEM
 * ============================================================================
 *
 * Shared design tokens, types, and primitives for the ArchivalIntroCard
 * component family. This ensures visual consistency across Desktop and Mobile
 * variants while eliminating duplication.
 *
 * PRINCIPLES:
 * - Single source of truth for all design values
 * - Type-safe tokens prevent magic numbers
 * - Mobile and Desktop share typography, color, and spacing
 * - Only interaction patterns differ between platforms
 * ============================================================================
 */

// =============================================================================
// COLOR PALETTE (Archival Material Aesthetic)
// =============================================================================

export const colors = {
  // Primary neutrals (ascending lightness)
  carbon: '#0a0a0a',      // Deepest background
  graphite: '#111111',    // Primary surface
  anthracite: '#161616',  // Secondary surface / mat border
  
  // Accent neutrals
  gunmetal: '#404040',    // Muted elements, borders
  nickel: '#a3a3a3',      // Secondary text
  silver: '#d4d4d4',      // Primary text accents
  platinum: '#e5e5e5',    // Headings, primary text
  
  // Functional
  sage: '#6b8b6b',        // Success/active states (muted)
} as const;

// =============================================================================
// TYPOGRAPHY SCALE (Space Grotesk + IBM Plex Mono)
// =============================================================================

export const typography = {
  families: {
    display: "'Space Grotesk', sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },
  
  sizes: {
    // Display scale (golden ratio)
    hero: 'clamp(3rem, 8vw, 6rem)',      // Name heading
    subhero: 'clamp(1.125rem, 2.5vw, 1.5rem)', // Statement
    role: '1.25rem',                      // Role description
    
    // UI scale
    label: '0.7rem',      // Section labels
    meta: '0.75rem',      // Metadata row
    caption: '0.65rem',   // Image captions
    body: '1rem',         // Email, body text
    social: '0.9rem',     // Social link labels
  },
  
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  letterSpacing: {
    tight: '-0.03em',
    normal: '0.02em',
    wide: '0.1em',
    ultraWide: '0.15em',
    label: '0.2em',
  },
  
  lineHeight: {
    tight: 0.9,
    normal: 1.6,
  },
} as const;

// =============================================================================
// SPACING SCALE (Golden Ratio: φ ≈ 1.618)
// =============================================================================

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.809rem',  // 13px (φ)
  md: '1.309rem',  // 21px (φ²)
  lg: '2.118rem',  // 34px (φ³)
  xl: '3.427rem',  // 55px (φ⁴)
} as const;

// =============================================================================
// MOTION CONFIGURATION
// =============================================================================

export const motion = {
  // Durations (in seconds)
  duration: {
    instant: 0.15,
    fast: 0.2,
    normal: 0.3,
    slow: 0.6,
    cinematic: 0.8,
  },
  
  // Easing functions
  easing: {
    // Standard
    ease: 'ease',
    easeOut: 'ease-out',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Expressive
    spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    
    // Cinematic
    outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    inOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  },
  
  // Stagger delays for sequential reveals
  stagger: {
    fast: 0.05,
    normal: 0.08,
    slow: 0.12,
  },
} as const;

// =============================================================================
// SHADOW SYSTEM (Layered Depth)
// =============================================================================

export const shadows = {
  // Card depth (z-axis separation)
  card: `
    0 1px 1px rgba(0,0,0,0.5),
    0 2px 2px rgba(0,0,0,0.4),
    0 4px 4px rgba(0,0,0,0.3),
    0 8px 8px rgba(0,0,0,0.2),
    0 16px 16px rgba(0,0,0,0.1)
  `,
  
  // Image frame depth
  imageMat: `
    inset 0 0 0 1px rgba(255,255,255,0.05),
    0 20px 40px -20px rgba(0,0,0,0.8)
  `,
  
  // Inner shadow for pressed effect
  inner: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  
  // Image inner vignette
  imageVignette: 'inset 0 0 20px rgba(0,0,0,0.5)',
} as const;

// =============================================================================
// BREAKPOINTS (For reference - capability detection preferred)
// =============================================================================

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '968px',
  wide: '1200px',
} as const;

// =============================================================================
// LAYOUT PRIMITIVES
// =============================================================================

export const layout = {
  // Grid ratios (asymmetric 12-column feel)
  grid: {
    visualRatio: '5fr',
    contentRatio: '7fr',
    gap: spacing.xl,
  },
  
  // Container constraints
  container: {
    maxWidth: '1100px',
    padding: {
      desktop: spacing.lg,
      mobile: spacing.md,
    },
  },
  
  // Touch targets (accessibility)
  touchTarget: {
    minSize: '44px',
    socialGrid: {
      desktop: 'repeat(2, 1fr)',
      mobile: '1fr',
    },
  },
} as const;

// =============================================================================
// Z-INDEX SCALE
// =============================================================================

export const zIndex = {
  ambientLight: 0,   // Background layer
  card: 10,          // Primary content
  grain: 50,         // Texture overlay
} as const;

// =============================================================================
// TYPES
// =============================================================================

export interface SocialLink {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
}

export interface CapabilityState {
  hasPointer: boolean;    // pointer: fine (mouse, stylus)
  hasTouch: boolean;      // pointer: coarse (touch)
  isHoverCapable: boolean; // hasPointer && !hasTouch
}

export interface PointerPosition {
  x: number;  // 0-100 percentage
  y: number;  // 0-100 percentage
}

// =============================================================================
// CONTENT DATA (Static)
// =============================================================================

export const content = {
  name: {
    first: 'Shiva',
    last: 'Pandey',
  },
  role: 'Software Engineer & Architect',
  email: 'Shivapanday9616527173@gmail.com',
  image: {
    src: '/images/reall.webp',
    alt: 'Shiva Pandey - Software Engineer',
    captionId: 'ID: SHIWA.2024',
    captionSpec: 'Type: Full Stack',
  },
  meta: {
    index: '01',
    status: 'Available for collaboration',
  },
  statement: `Building full-stack applications with design-first philosophy. 
Focused on production-ready systems, seamless user experiences, 
and architectural elegance. Preparing for GATE2027.`,
  labels: {
    contact: 'Contact',
    connect: 'Connect',
  },
} as const;

// Social links will be created with React components in the component files
// since they require JSX for the icon components
