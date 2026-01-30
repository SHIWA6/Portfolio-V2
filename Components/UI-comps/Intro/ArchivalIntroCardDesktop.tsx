/**
 * ============================================================================
 * ARCHIVAL INTRO CARD - DESKTOP VARIANT
 * ============================================================================
 *
 * Cinematic, motion-rich experience for pointer-capable devices (mouse/stylus).
 *
 * FEATURES:
 * - Ambient light following cursor position (CSS custom properties)
 * - Magnetic buttons with spring physics (RAF-throttled)
 * - Staggered kinetic text reveals (word-level for performance)
 * - Grain overlay and corner details for tactile depth
 * - Respects prefers-reduced-motion
 *
 * PERFORMANCE STRATEGY:
 * - GPU-only animations (transform + opacity)
 * - CSS custom properties for high-frequency updates (no React re-renders)
 * - RAF throttling caps pointer tracking to 60Hz
 * - Memoized sub-components prevent unnecessary renders
 * - Static content for SSR, progressive enhancement on hydration
 *
 * WHY THESE EFFECTS DESKTOP-ONLY:
 * - Cursor tracking: No cursor on touch devices (would be confusing)
 * - Magnetic buttons: No hover state to trigger attraction
 * - Continuous ambient light: Battery drain without benefit on mobile
 * - Staggered reveals: Can feel slow on mobile where speed is valued
 * ============================================================================
 */

"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

import { SocialLink } from './shared/design-system';
import { useCssPointerTracking } from './shared/hooks';
import styles from './archival-card.module.scss';

// =============================================================================
// TYPES
// =============================================================================

interface DesktopCardProps {
  socials: SocialLink[];
}

interface MagneticButtonProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  prefersReducedMotion: boolean | null;
}

interface KineticTextProps {
  text: string;
  className?: string;
  prefersReducedMotion: boolean | null;
}

interface AmbientLightProps {
  enabled: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// =============================================================================
// MAGNETIC BUTTON
// =============================================================================

/**
 * Magnetic Button - Tactile hover effect with spring physics.
 *
 * INTERACTION DESIGN:
 * Button subtly follows cursor within 8px radius, creating a "magnetic pull"
 * sensation that increases affordance without overwhelming the user.
 *
 * PERFORMANCE:
 * - RAF-throttled updates (60Hz cap)
 * - CSS transforms only (GPU-accelerated)
 * - Cleanup on unmount prevents memory leaks
 *
 * ACCESSIBILITY:
 * - Disabled when reduced motion is preferred
 * - Keyboard focus indicator via CSS :focus-visible
 * - Semantic anchor element (not button) since these navigate
 *
 * @param prefersReducedMotion - Disables effect when user prefers reduced motion
 */
const MagneticButton = memo(function MagneticButton({
  children,
  href,
  className,
  prefersReducedMotion,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  // Disable magnetic effect for accessibility
  const enableMagnetic = !prefersReducedMotion;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!enableMagnetic || !buttonRef.current) return;

    // Cancel pending RAF to prevent queue buildup
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // 8px max displacement (subtle, not gimmicky)
      setTransform({
        x: (e.clientX - centerX) * 0.08,
        y: (e.clientY - centerY) * 0.08,
      });
    });
  }, [enableMagnetic]);

  const handleMouseLeave = useCallback(() => {
    if (!enableMagnetic) return;
    
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    setTransform({ x: 0, y: 0 });
  }, [enableMagnetic]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <a
      ref={buttonRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.magneticButton} ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: enableMagnetic 
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)` 
          : undefined,
        transition: enableMagnetic ? 'transform 0.2s ease-out' : undefined,
        willChange: enableMagnetic ? 'transform' : undefined,
      }}
    >
      {children}
    </a>
  );
});

// =============================================================================
// KINETIC TEXT
// =============================================================================

/**
 * Kinetic Text - Staggered word reveal animation.
 *
 * ANIMATION STRATEGY:
 * Word-level reveals (not character-level) for optimal performance.
 * Character-level creates visual noise and can cause CLS with variable-width
 * letters. Word-level maintains readability while preserving cinematic entrance.
 *
 * CLS PREVENTION:
 * Each word wrapper has fixed dimensions via CSS 'contain: layout style',
 * ensuring layout stability during animation.
 *
 * @param prefersReducedMotion - Renders static text when user prefers reduced motion
 */
const KineticText = memo(function KineticText({
  text,
  className,
  prefersReducedMotion,
}: KineticTextProps) {
  const words = text.split(' ');

  // Static render for reduced motion - immediate, no animation
  if (prefersReducedMotion) {
    return <span className={`${styles.kineticText} ${className || ''}`}>{text}</span>;
  }

  return (
    <span className={`${styles.kineticText} ${className || ''}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className={styles.kineticWord}
          style={{
            // GPU-accelerated CSS animation (better than JS-driven for simple fades)
            animation: `${styles.fadeInUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.08}s forwards`,
            opacity: 0, // Start hidden, animation reveals
          }}
        >
          {word}
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  );
});

// =============================================================================
// AMBIENT LIGHT
// =============================================================================

/**
 * Ambient Light - Subtle spotlight following cursor position.
 *
 * PERFORMANCE BREAKTHROUGH:
 * Uses CSS custom properties (--cursor-x, --cursor-y) instead of React state
 * for the gradient position. This avoids React re-renders entirely - the
 * browser updates the gradient directly via CSSOM.
 *
 * WHY THIS MATTERS:
 * CSS custom properties are GPU-composited and don't trigger layout/paint,
 * unlike React state updates which cause component re-renders. At 60Hz cursor
 * updates, this difference is the line between 60fps and stuttering.
 *
 * @param enabled - Whether to show ambient light (false on touch/reduced motion)
 * @param containerRef - Ref to element for CSS custom property updates
 */
const AmbientLight = memo(function AmbientLight({ enabled, containerRef }: AmbientLightProps) {
  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className={styles.ambientLight}
      style={{
        // Initial values, updated via CSS custom properties in useCssPointerTracking
        '--cursor-x': '50%',
        '--cursor-y': '50%',
      } as React.CSSProperties}
    />
  );
});

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ArchivalIntroCardDesktop - Cinematic desktop experience.
 *
 * RESPONSIBILITIES:
 * - Cursor-following ambient light (via CSS custom properties)
 * - Magnetic button physics (RAF-throttled)
 * - Staggered text reveals (word-level animations)
 * - Grain overlay and corner craftsmanship details
 *
 * RENDER TARGET:
 * pointer: fine devices (desktop with mouse, laptops, some tablets with stylus)
 *
 * @param socials - Array of social links with icons
 */
export default function ArchivalIntroCardDesktop({ socials }: DesktopCardProps) {
  // Accessibility: Respect user's motion preferences
  const prefersReducedMotion = useReducedMotion();
  
  // Performance: CSS custom property tracking (zero React re-renders)
  const ambientRef = useCssPointerTracking(
    !prefersReducedMotion,
    '--cursor'
  );

  return (
    <div className={styles.container}>
      {/* 
        Ambient Light Layer
        Creates subtle depth through z-axis lighting.
        Disabled when reduced motion is preferred.
        Updated via CSS custom properties (not React state) for 60fps performance.
      */}
      <AmbientLight 
        enabled={!prefersReducedMotion}
        containerRef={ambientRef}
      />

      <main className={styles.card}>
        {/* Layer 1: The Mat (creates physical depth) */}
        <div className={styles.matBorder}>
          
          {/* Layer 2: Primary Surface */}
          <div className={styles.surface}>
            
            {/* Grid Architecture: Asymmetric 12-column feel */}
            <div className={styles.grid}>
              
              {/* LEFT: Visual Anchor */}
              <div className={styles.visualColumn}>
                <div className={styles.imageContainer}>
                  <div className={styles.imageMat}>
                    <div className={styles.imageFrame}>
                      <Image
                        src="/images/reall.webp"
                        alt="Shiva Pandey - Software Engineer"
                        width={400}
                        height={400}
                        priority
                        className={styles.portrait}
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  </div>
                  
                  {/* Technical metadata - archival aesthetic */}
                  <div className={styles.imageCaption}>
                    <span className={styles.captionId}>ID: SHIWA.2024</span>
                    <span className={styles.captionSpec}>Type: Full Stack</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Information Architecture */}
              <div className={styles.contentColumn}>
                
                {/* Header: Typographic contrast */}
                <header className={styles.header}>
                  <div className={styles.metaRow}>
                    <span className={styles.index}>01</span>
                    <div className={styles.divider} />
                    <span className={styles.status}>Available for collaboration</span>
                  </div>

                  <h1 className={styles.name}>
                    <KineticText 
                      text="Shiva" 
                      prefersReducedMotion={prefersReducedMotion}
                    />
                    <span className={styles.nameAccent}>Pandey</span>
                  </h1>

                  <p className={styles.role}>
                    Software Engineer & Architect
                  </p>
                </header>

                {/* Contact: Technical specification style */}
                <div className={styles.contactBlock}>
                  <div className={styles.contactLabel}>Contact</div>
                  <MagneticButton 
                    href="mailto:Shivapanday9616527173@gmail.com"
                    className={styles.emailLink}
                    prefersReducedMotion={prefersReducedMotion}
                  >
                    <span>Shivapanday9616527173@gmail.com</span>
                    <FaArrowUpRightFromSquare className={styles.linkIcon} aria-hidden />
                  </MagneticButton>
                </div>

                {/* Social: Minimal seals */}
                <div className={styles.socialBlock}>
                  <div className={styles.contactLabel}>Connect</div>
                  <div className={styles.socialGrid} role="list">
                    {socials.map((social) => (
                      <MagneticButton 
                        key={social.id} 
                        href={social.href}
                        className={styles.socialLink}
                        prefersReducedMotion={prefersReducedMotion}
                      >
                        <span className={styles.socialIcon}>{social.icon}</span>
                        <span className={styles.socialLabel}>{social.label}</span>
                      </MagneticButton>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer: Statement */}
            <div className={styles.statementSection}>
              <div className={styles.statementBorder}>
                <p className={styles.statement}>
                  Building full-stack applications with design-first philosophy. 
                  Focused on production-ready systems, seamless user experiences, 
                  and architectural elegance. Preparing for GATE2027.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Corner Details - invisible craftsmanship */}
        <div className={`${styles.corner} ${styles.cornerTL}`} aria-hidden />
        <div className={`${styles.corner} ${styles.cornerTR}`} aria-hidden />
        <div className={`${styles.corner} ${styles.cornerBL}`} aria-hidden />
        <div className={`${styles.corner} ${styles.cornerBR}`} aria-hidden />
      </main>

      {/* Grain Overlay - material realism */}
      <div className={styles.grain} aria-hidden />
    </div>
  );
}
