

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
// SHARED CONTENT STRUCTURE
// =============================================================================

/**
 * CardContent - Vertical hierarchy: image → identity → contact → socials
 * Designed for mobile-first reading flow with reduced visual weight.
 */
function CardContent({ socials }: { socials: SocialLink[] }) {
  return (
    <main className={styles.card}>
      <div className={styles.matBorder}>
        <div className={`${styles.surface} ${styles.surfaceMobile}`}>
          
          {/* IDENTITY SECTION: Name + role as single typographic unit */}
          <section className={styles.identitySection}>
            
            {/* Image: Circular identity seal (88px) */}
            <div className={styles.identityVisual}>
              <div className={styles.imageFrameMobile}>
                <Image
                  src="/images/reall.webp"
                  alt="Shiva Pandey"
                  width={88}
                  height={88}
                  priority
                  className={styles.portraitMobile}
                  sizes="88px"
                />
              </div>
              {/* REMOVED: imageCaptionMobile - technical metadata competes with identity */}
            </div>

            {/* Name and Role: Bonded typographic unit */}
            <header className={styles.identityHeader}>
              {/* REMOVED: metaRowMobile with status indicator - visual noise on small screens */}

              <h1 className={styles.nameMobile}>
                <span>Shiva</span>
                <span className={styles.nameAccentMobile}>Pandey</span>
              </h1>

              <p className={styles.roleMobile}>
                Software Engineer & Architect
              </p>
            </header>

          </section>

          {/* CONTACT SECTION: Quiet metadata, not CTA */}
          <section className={styles.contactSectionMobile}>
            {/* REMOVED: sectionLabelMobile - reduces visual hierarchy */}
            <StaticLink
              href="mailto:Shivapanday9616527173@gmail.com"
              className={styles.emailLinkMobile}
            >
              Shivapanday9616527173@gmail.com
              {/* REMOVED: linkIconMobile - icon competes with metadata styling */}
            </StaticLink>
          </section>

          {/* SOCIALS SECTION: Single column minimal pills */}
          <section className={styles.socialsSectionMobile}>
            {/* REMOVED: sectionLabelMobile - reduced visual noise */}
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

          {/* STATEMENT: Footnote treatment at bottom */}
          <section className={styles.statementSectionMobile}>
            <p className={styles.statementMobile}>
              Building full-stack applications with design-first philosophy.
              Focused on production-ready systems and architectural elegance.
            </p>
          </section>

        </div>
      </div>

      {/* Corner Details - Subtle craftsmanship */}
      <div className={`${styles.corner} ${styles.cornerTL}`} aria-hidden />
      <div className={`${styles.corner} ${styles.cornerTR}`} aria-hidden />
      <div className={`${styles.corner} ${styles.cornerBL}`} aria-hidden />
      <div className={`${styles.corner} ${styles.cornerBR}`} aria-hidden />
    </main>
  );
}

// =============================================================================
// STATIC VERSION (No animations, for reduced motion)
// =============================================================================

function StaticMobileCard({ socials }: MobileCardProps) {
  return (
    <div className={styles.container}>
      <CardContent socials={socials} />
      <div className={styles.grain} aria-hidden />
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
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function AnimatedMobileCard({ socials }: MobileCardProps) {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className={styles.matBorder}>
          <motion.div 
            className={`${styles.surface} ${styles.surfaceMobile}`}
            variants={itemVariants}
          >
            
            {/* IDENTITY SECTION: Name + role as single typographic unit */}
            <section className={styles.identitySection}>
              
              {/* Image: Circular identity seal (88px) */}
              <motion.div className={styles.identityVisual} variants={itemVariants}>
                <div className={styles.imageFrameMobile}>
                  <Image
                    src="/images/reall.webp"
                    alt="Shiva Pandey"
                    width={88}
                    height={88}
                    priority
                    className={styles.portraitMobile}
                    sizes="88px"
                  />
                </div>
                {/* REMOVED: imageCaptionMobile - technical metadata competes with identity */}
              </motion.div>

              {/* Name and Role: Bonded typographic unit */}
              <header className={styles.identityHeader}>
                {/* REMOVED: metaRowMobile with status indicator - visual noise on small screens */}

                <motion.h1 className={styles.nameMobile} variants={itemVariants}>
                  <span>Shiva</span>
                  <span className={styles.nameAccentMobile}>Pandey</span>
                </motion.h1>

                <motion.p className={styles.roleMobile} variants={itemVariants}>
                  Software Engineer & Architect
                </motion.p>
              </header>

            </section>

            {/* CONTACT SECTION: Quiet metadata, not CTA */}
            <motion.section
              className={styles.contactSectionMobile}
              variants={itemVariants}
            >
              {/* REMOVED: sectionLabelMobile - reduces visual hierarchy */}
              <StaticLink
                href="mailto:Shivapanday9616527173@gmail.com"
                className={styles.emailLinkMobile}
              >
                Shivapanday9616527173@gmail.com
                {/* REMOVED: linkIconMobile - icon competes with metadata styling */}
              </StaticLink>
            </motion.section>

            {/* SOCIALS SECTION: Single column minimal pills */}
            <motion.section
              className={styles.socialsSectionMobile}
              variants={itemVariants}
            >
              {/* REMOVED: sectionLabelMobile - reduced visual noise */}
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

        {/* Corner Details */}
        <div className={`${styles.corner} ${styles.cornerTL}`} aria-hidden />
        <div className={`${styles.corner} ${styles.cornerTR}`} aria-hidden />
        <div className={`${styles.corner} ${styles.cornerBL}`} aria-hidden />
        <div className={`${styles.corner} ${styles.cornerBR}`} aria-hidden />
      </motion.div>

      <div className={styles.grain} aria-hidden />
    </div>
  );
}

// =============================================================================
// MAIN EXPORT
// =============================================================================

/**
 * ArchivalIntroCardMobile - Touch-optimized, editorial mobile experience.
 *
 * Renders either static or animated version based on reduced motion preference.
 * Animation is one-time entrance only — no continuous effects.
 */
export default function ArchivalIntroCardMobile({ socials }: MobileCardProps) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <StaticMobileCard socials={socials} />;
  }

  return <AnimatedMobileCard socials={socials} />;
}
