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
 * CardContent - Mobile-first identity card
 * 
 * Viewport discipline (390×844):
 * - Total content height: ~466px
 * - Identity visible within first 525px
 * - Image: 72px (reduced dominance via size + vignette)
 * - Typography: Increased weight for hierarchy shift
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
      {/* Interaction glow - off by default, on touch/hover only */}
      <div 
        className={`${styles.interactionGlow} ${isActive ? styles.active : ''}`}
        aria-hidden
      />
      
      <div className={styles.matBorder}>
        <div className={`${styles.surface} ${styles.surfaceMobile}`}>
          
          {/* IDENTITY SECTION: Image supports identity, doesn't dominate */}
          <section className={styles.identitySection}>
            
            {/* Image: 72px identity seal with vignette */}
            <div className={styles.identityVisual}>
              <div className={styles.imageFrameMobile}>
                <Image
                  src="/images/reall.webp"
                  alt="Shiva Pandey"
                  width={72}
                  height={72}
                  priority
                  className={styles.portraitMobile}
                  sizes="72px"
                />
              </div>
            </div>

            {/* Name and Role: Typography gains visual weight */}
            <header className={styles.identityHeader}>
              <h1 className={styles.nameMobile}>
                <span>Shiva</span>
                <span className={styles.nameAccentMobile}>Pandey</span>
              </h1>

              <p className={styles.roleMobile}>
                Software Engineer & Architect
              </p>
            </header>

          </section>

          {/* CONTACT: Quiet metadata */}
          <section className={styles.contactSectionMobile}>
            <StaticLink
              href="mailto:Shivapanday9616527173@gmail.com"
              className={styles.emailLinkMobile}
            >
              Shivapanday9616527173@gmail.com
            </StaticLink>
          </section>

          {/* SOCIALS: Single column compact */}
          <section className={styles.socialsSectionMobile}>
            <div className={styles.socialGridCompact} role="list">
              {socials.map((social) => (
                <StaticLink
                  key={social.id}
                  href={social.href}
                  className={styles.socialLinkCompact}
                >
                  <span className={styles.socialIconCompact}>{social.icon}</span>
                  <span className={styles.socialLabelCompact}>{social.label}</span>
                </StaticLink>
              ))}
            </div>
          </section>

          {/* STATEMENT: Footnote at bottom */}
          <section className={styles.statementSectionMobile}>
            <p className={styles.statementMobile}>
              Building full-stack applications with design-first philosophy.
              Focused on production-ready systems and architectural elegance.
            </p>
          </section>

        </div>
      </div>

      {/* REMOVED: Corner details - visual noise on small screens */}
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
      {/* REMOVED: grain overlay - visual noise on mobile */}
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
        {/* Interaction glow - off by default, on interaction only */}
        <motion.div 
          className={`${styles.interactionGlow} ${isActive ? styles.active : ''}`}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
        
        <div className={styles.matBorder}>
          <motion.div 
            className={`${styles.surface} ${styles.surfaceMobile}`}
            variants={itemVariants}
          >
            
            {/* IDENTITY SECTION */}
            <section className={styles.identitySection}>
              
              {/* Image: 72px with vignette, object-position focus */}
              <motion.div className={styles.identityVisual} variants={itemVariants}>
                <div className={styles.imageFrameMobile}>
                  <Image
                    src="/images/reall.webp"
                    alt="Shiva Pandey"
                    width={72}
                    height={72}
                    priority
                    className={styles.portraitMobile}
                    sizes="72px"
                  />
                </div>
              </motion.div>

              {/* Name and Role: Increased weight */}
              <header className={styles.identityHeader}>
                <motion.h1 className={styles.nameMobile} variants={itemVariants}>
                  <span>Shiva</span>
                  <span className={styles.nameAccentMobile}>Pandey</span>
                </motion.h1>

                <motion.p className={styles.roleMobile} variants={itemVariants}>
                  Software Engineer & Architect
                </motion.p>
              </header>

            </section>

            {/* CONTACT */}
            <motion.section 
              className={styles.contactSectionMobile} 
              variants={itemVariants}
            >
              <StaticLink
                href="mailto:Shivapanday9616527173@gmail.com"
                className={styles.emailLinkMobile}
              >
                Shivapanday9616527173@gmail.com
              </StaticLink>
            </motion.section>

            {/* SOCIALS */}
            <motion.section 
              className={styles.socialsSectionMobile} 
              variants={itemVariants}
            >
              <div className={styles.socialGridCompact} role="list">
                {socials.map((social) => (
                  <StaticLink
                    key={social.id}
                    href={social.href}
                    className={styles.socialLinkCompact}
                  >
                    <span className={styles.socialIconCompact}>{social.icon}</span>
                    <span className={styles.socialLabelCompact}>{social.label}</span>
                  </StaticLink>
                ))}
              </div>
            </motion.section>

            {/* STATEMENT */}
            <motion.section 
              className={styles.statementSectionMobile} 
              variants={itemVariants}
            >
              <p className={styles.statementMobile}>
                Building full-stack applications with design-first philosophy.
                Focused on production-ready systems and architectural elegance.
              </p>
            </motion.section>

          </motion.div>
        </div>

        {/* REMOVED: Corner details - visual noise on mobile */}
      </motion.div>

      {/* REMOVED: grain overlay - reduces visual noise */}
    </div>
  );
}

// =============================================================================
// MAIN EXPORT
// =============================================================================

/**
 * ArchivalIntroCardMobile - Touch-optimized for 390×844
 * 
 * First-fold discipline:
 * - Identity visible without scrolling
 * - Image: 72px (supports, doesn't dominate)
 * - Typography: Increased weight for hierarchy
 * - Glow: Off by default, on interaction only
 * - Grain: Disabled on mobile
 */
export default function ArchivalIntroCardMobile({ socials }: MobileCardProps) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <StaticMobileCard socials={socials} />;
  }

  return <AnimatedMobileCard socials={socials} />;
}
