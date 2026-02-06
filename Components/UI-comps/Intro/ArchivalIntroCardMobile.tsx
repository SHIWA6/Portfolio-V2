"use client";

import React, { memo } from 'react';
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
 * CardContent - Mobile-first IDENTITY CARD
 * 
 * Viewport: 390×844 first-fold optimized
 * 
 * Reading order (strict hierarchy):
 * 1. Image (44px - identity seal, NOT hero)
 * 2. Name (primary)
 * 3. Role (secondary, bonded to name)
 * 4. Status (availability)
 * 5. Email (quiet metadata)
 * 6. Socials (utility pills)
 */
function CardContent({ socials }: { socials: SocialLink[] }) {
  return (
    <main className={`${styles.card} ${styles.cardMobile}`}>
      <div className={styles.matBorderMobile}>
        <div className={`${styles.surface} ${styles.surfaceMobile}`}>
          
          {/* ====== IDENTITY UNIT ====== */}
          {/* Image + Name + Role + Status = ONE cohesive block */}
          <section className={styles.identityUnit}>
            
            {/* Image: Responsive seal (44px → 36px on ultra-small) */}
            <div className={styles.identitySeal}>
              <Image
                src="/images/reall.webp"
                alt="Shiva Pandey"
                width={44}
                height={44}
                priority
                className={styles.portraitMobile}
                sizes="(max-width: 320px) 36px, (max-width: 360px) 40px, 44px"
              />
            </div>

            {/* Name: Primary focus */}
            <h1 className={styles.nameMobile}>
              <span>Shiva</span>
              <span className={styles.nameAccentMobile}>Pandey</span>
            </h1>

            {/* Role: Secondary, tight coupling */}
            <p className={styles.roleMobile}>
              Software Engineer & Architect
            </p>

            {/* Status: Availability */}
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

          {/* ====== SOCIAL LINKS (utility pills) ====== */}
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
  return (
    <div className={`${styles.container} ${styles.containerMobile}`}>
      <motion.div
        className={`${styles.card} ${styles.cardMobile}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className={styles.matBorderMobile}>
          <motion.div 
            className={`${styles.surface} ${styles.surfaceMobile}`}
            variants={itemVariants}
          >
            
            {/* ====== IDENTITY UNIT ====== */}
            <section className={styles.identityUnit}>
              
              {/* Image: Responsive seal */}
              <motion.div className={styles.identitySeal} variants={itemVariants}>
                <Image
                  src="/images/reall.webp"
                  alt="Shiva Pandey"
                  width={44}
                  height={44}
                  priority
                  className={styles.portraitMobile}
                  sizes="(max-width: 320px) 36px, (max-width: 360px) 40px, 44px"
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
 * ArchivalIntroCardMobile - Editorial Identity Card for 390×844
 * 
 * Philosophy: CALM, EDITORIAL, INTENTIONAL
 * 
 * First-fold guarantee (no scroll required):
 * - Image: 44px identity seal (supports, doesn't dominate)
 * - Name: Primary focus (tight line-height)
 * - Role: Secondary (bonded to name with 2px gap)
 * - Status: "Available for collaboration"
 * - Email: Quiet metadata (low opacity, no background)
 * - Socials: Pill buttons (utility, not feature)
 * 
 * What was removed:
 * - Touch glow effect (hover metaphor doesn't translate)
 * - Multiple shadow layers
 * - Background states on email
 * - Large circular social buttons
 * - Golden ratio spacing
 * 
 * Visual discipline:
 * - Single shadow layer
 * - No interaction glow
 * - Tight 4px/8px/12px spacing rhythm
 * - Pill-shaped social buttons (not circles)
 */
export default function ArchivalIntroCardMobile({ socials }: MobileCardProps) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <StaticMobileCard socials={socials} />;
  }

  return <AnimatedMobileCard socials={socials} />;
}
