

"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

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
          
          {/* IDENTITY SECTION: Centered, compact */}
          <section className={styles.identitySection}>
            
            {/* Image: Identity seal, not hero */}
            <div className={styles.identityVisual}>
              <div className={styles.imageMatMobile}>
                <div className={styles.imageFrameMobile}>
                  <Image
                    src="/images/reall.webp"
                    alt="Shiva Pandey"
                    width={120}
                    height={120}
                    priority
                    className={styles.portraitMobile}
                    sizes="120px"
                  />
                </div>
              </div>
              
              {/* Technical metadata - minimal */}
              <div className={styles.imageCaptionMobile}>
                <span>SHIWA.2024</span>
                <span className={styles.captionDivider}>·</span>
                <span>Full Stack</span>
              </div>
            </div>

            {/* Name and Role */}
            <header className={styles.identityHeader}>
              <div className={styles.metaRowMobile}>
                <span className={styles.statusIndicator} />
                <span className={styles.statusText}>Available</span>
              </div>

              <h1 className={styles.nameMobile}>
                <span>Shiva</span>
                <span className={styles.nameAccentMobile}>Pandey</span>
              </h1>

              <p className={styles.roleMobile}>
                Software Engineer & Architect
              </p>
            </header>

          </section>

          {/* CONTACT SECTION: Email as metadata */}
          <section className={styles.contactSectionMobile}>
            <div className={styles.sectionLabelMobile}>Contact</div>
            <StaticLink 
              href="mailto:Shivapanday9616527173@gmail.com"
              className={styles.emailLinkMobile}
            >
              <span>Shivapanday9616527173@gmail.com</span>
              <FaArrowUpRightFromSquare className={styles.linkIconMobile} aria-hidden />
            </StaticLink>
          </section>

          {/* SOCIALS SECTION: Compact grid */}
          <section className={styles.socialsSectionMobile}>
            <div className={styles.sectionLabelMobile}>Connect</div>
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

          {/* STATEMENT: Simplified, no heavy border */}
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
            
            {/* IDENTITY SECTION */}
            <section className={styles.identitySection}>
              
              {/* Image: Identity seal */}
              <motion.div className={styles.identityVisual} variants={itemVariants}>
                <div className={styles.imageMatMobile}>
                  <div className={styles.imageFrameMobile}>
                    <Image
                      src="/images/reall.webp"
                      alt="Shiva Pandey"
                      width={120}
                      height={120}
                      priority
                      className={styles.portraitMobile}
                      sizes="120px"
                    />
                  </div>
                </div>
                
                <div className={styles.imageCaptionMobile}>
                  <span>SHIWA.2024</span>
                  <span className={styles.captionDivider}>·</span>
                  <span>Full Stack</span>
                </div>
              </motion.div>

              {/* Name and Role */}
              <header className={styles.identityHeader}>
                <motion.div className={styles.metaRowMobile} variants={itemVariants}>
                  <span className={styles.statusIndicator} />
                  <span className={styles.statusText}>Available</span>
                </motion.div>

                <motion.h1 className={styles.nameMobile} variants={itemVariants}>
                  <span>Shiva</span>
                  <span className={styles.nameAccentMobile}>Pandey</span>
                </motion.h1>

                <motion.p className={styles.roleMobile} variants={itemVariants}>
                  Software Engineer & Architect
                </motion.p>
              </header>

            </section>

            {/* CONTACT SECTION */}
            <motion.section 
              className={styles.contactSectionMobile} 
              variants={itemVariants}
            >
              <div className={styles.sectionLabelMobile}>Contact</div>
              <StaticLink 
                href="mailto:Shivapanday9616527173@gmail.com"
                className={styles.emailLinkMobile}
              >
                <span>Shivapanday9616527173@gmail.com</span>
                <FaArrowUpRightFromSquare className={styles.linkIconMobile} aria-hidden />
              </StaticLink>
            </motion.section>

            {/* SOCIALS SECTION */}
            <motion.section 
              className={styles.socialsSectionMobile} 
              variants={itemVariants}
            >
              <div className={styles.sectionLabelMobile}>Connect</div>
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
