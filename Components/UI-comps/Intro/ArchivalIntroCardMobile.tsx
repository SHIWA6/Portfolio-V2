"use client";

import React, { memo, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, Variants } from 'framer-motion';

import { SocialLink } from './shared/design-system';
import styles from './archival-card.module.scss';

// =============================================================================
// TYPES
// =============================================================================

interface MobileCardProps {
  socials: SocialLink[];
}

// =============================================================================
// TOUCH GLOW HOOK - Interaction-based glow (off by default)
// =============================================================================

function useTouchGlow() {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      setPosition({ x, y });
    }
    setIsActive(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x, y });
    }
    setIsActive(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    containerRef,
    isActive,
    position,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}

// =============================================================================
// STATIC LINK COMPONENT
// =============================================================================

const StaticLink = memo(function StaticLink({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.magneticButton} ${className || ''}`}
    >
      {children}
    </a>
  );
});

// =============================================================================
// CARD CONTENT - Optimized for 390×844 first-fold
// =============================================================================

/**
 * CardContent - Mobile-first IDENTITY CARD (not a poster)
 * 
 * Viewport discipline (390×844):
 * - Safe area: ~59px top, ~34px bottom → usable: 751px
 * - First fold target: 70% → ~525px
 * - Actual content height: ~380px ✓
 * 
 * Reading order (strict hierarchy):
 * 1. Image (64px - identity seal, not hero)
 * 2. Name (primary)
 * 3. Role (secondary)
 * 4. Status (availability)
 * 5. Email (metadata)
 * 6. Socials (grouped unit)
 */
function CardContent({ socials }: { socials: SocialLink[] }) {
  const { containerRef, isActive, position, handlers } = useTouchGlow();

  return (
    <main 
      className={`${styles.card} ${styles.cardMobile}`}
      ref={containerRef}
      {...handlers}
      style={{
        '--touch-x': `${position.x}%`,
        '--touch-y': `${position.y}%`,
      } as React.CSSProperties}
    >
      {/* Interaction glow - off by default, on tap only */}
      <div 
        className={`${styles.interactionGlow} ${isActive ? styles.active : ''}`}
        aria-hidden
      />
      
      <div className={styles.matBorderMobile}>
        <div className={`${styles.surface} ${styles.surfaceMobile}`}>
          
          {/* ====== IDENTITY UNIT ====== */}
          {/* Image + Name + Role + Status = ONE cohesive block */}
          <section className={styles.identityUnit}>
            
            {/* Image: 64px seal - supports identity, doesn't dominate */}
            <div className={styles.identitySeal}>
              <Image
                src="/images/reall.webp"
                alt="Shiva Pandey"
                width={64}
                height={64}
                priority
                className={styles.portraitMobile}
                sizes="64px"
              />
            </div>

            {/* Name: Primary focus */}
            <h1 className={styles.nameMobile}>
              <span>Shiva</span>
              <span className={styles.nameAccentMobile}>Pandey</span>
            </h1>

            {/* Role: Secondary */}
            <p className={styles.roleMobile}>
              Software Engineer & Architect
            </p>

            {/* Status: Availability tied to identity */}
            <div className={styles.statusBadge}>
              <span className={styles.statusDot} aria-hidden />
              <span>Available for collaboration</span>
            </div>

          </section>

          {/* ====== CONTACT METADATA ====== */}
          <section className={styles.contactMeta}>
            <StaticLink
              href="mailto:Shivapanday9616527173@gmail.com"
              className={styles.emailMeta}
            >
              Shivapanday9616527173@gmail.com
            </StaticLink>
          </section>

          {/* ====== SOCIAL LINKS (grouped unit) ====== */}
          <nav className={styles.socialUnit} aria-label="Social links">
            <div className={styles.socialRow} role="list">
              {socials.map((social) => (
                <StaticLink
                  key={social.id}
                  href={social.href}
                  className={styles.socialChip}
                >
                  <span className={styles.socialChipIcon}>{social.icon}</span>
                </StaticLink>
              ))}
            </div>
          </nav>

        </div>
      </div>
    </main>
  );
}

// =============================================================================
// STATIC VERSION (No animations, for reduced motion)
// =============================================================================

function StaticMobileCard({ socials }: MobileCardProps) {
  return (
    <div className={`${styles.container} ${styles.containerMobile}`}>
      <CardContent socials={socials} />
    </div>
  );
}

// =============================================================================
// ANIMATED VERSION (One-time entrance only)
// =============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function AnimatedMobileCard({ socials }: MobileCardProps) {
  const { containerRef, isActive, position, handlers } = useTouchGlow();

  return (
    <div className={`${styles.container} ${styles.containerMobile}`}>
      <motion.div
        className={`${styles.card} ${styles.cardMobile}`}
        ref={containerRef}
        {...handlers}
        style={{
          '--touch-x': `${position.x}%`,
          '--touch-y': `${position.y}%`,
        } as React.CSSProperties}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Interaction glow - off by default, on tap only */}
        <motion.div 
          className={`${styles.interactionGlow} ${isActive ? styles.active : ''}`}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
        
        <div className={styles.matBorderMobile}>
          <motion.div 
            className={`${styles.surface} ${styles.surfaceMobile}`}
            variants={itemVariants}
          >
            
            {/* ====== IDENTITY UNIT ====== */}
            <section className={styles.identityUnit}>
              
              {/* Image: 64px seal */}
              <motion.div className={styles.identitySeal} variants={itemVariants}>
                <Image
                  src="/images/reall.webp"
                  alt="Shiva Pandey"
                  width={64}
                  height={64}
                  priority
                  className={styles.portraitMobile}
                  sizes="64px"
                />
              </motion.div>

              {/* Name */}
              <motion.h1 className={styles.nameMobile} variants={itemVariants}>
                <span>Shiva</span>
                <span className={styles.nameAccentMobile}>Pandey</span>
              </motion.h1>

              {/* Role */}
              <motion.p className={styles.roleMobile} variants={itemVariants}>
                Software Engineer & Architect
              </motion.p>

              {/* Status */}
              <motion.div className={styles.statusBadge} variants={itemVariants}>
                <span className={styles.statusDot} aria-hidden />
                <span>Available for collaboration</span>
              </motion.div>

            </section>

            {/* ====== CONTACT METADATA ====== */}
            <motion.section className={styles.contactMeta} variants={itemVariants}>
              <StaticLink
                href="mailto:Shivapanday9616527173@gmail.com"
                className={styles.emailMeta}
              >
                Shivapanday9616527173@gmail.com
              </StaticLink>
            </motion.section>

            {/* ====== SOCIAL LINKS ====== */}
            <motion.nav 
              className={styles.socialUnit} 
              aria-label="Social links"
              variants={itemVariants}
            >
              <div className={styles.socialRow} role="list">
                {socials.map((social) => (
                  <StaticLink
                    key={social.id}
                    href={social.href}
                    className={styles.socialChip}
                  >
                    <span className={styles.socialChipIcon}>{social.icon}</span>
                  </StaticLink>
                ))}
              </div>
            </motion.nav>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// =============================================================================
// MAIN EXPORT
// =============================================================================

/**
 * ArchivalIntroCardMobile - Identity Card optimized for 390×844
 * 
 * Philosophy: IDENTITY CARD, not a poster
 * 
 * First-fold guarantee (no scroll required):
 * - Image: 64px identity seal (supports, doesn't dominate)
 * - Name: Primary focus (increased weight)
 * - Role: Secondary
 * - Status: "Available for collaboration"
 * - Email: Quiet metadata
 * - Socials: Icon-only horizontal row
 * 
 * Viewport math:
 * - 390×844 usable: ~751px (minus safe areas)
 * - Content height: ~320px (well within first fold)
 * 
 * Visual discipline:
 * - Single shadow layer (no stacked shadows)
 * - Glow: OFF by default, ON only on tap
 * - No grain overlay
 * - No decorative corners
 * - Flat-but-premium aesthetic
 */
export default function ArchivalIntroCardMobile({ socials }: MobileCardProps) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <StaticMobileCard socials={socials} />;
  }

  return <AnimatedMobileCard socials={socials} />;
}
