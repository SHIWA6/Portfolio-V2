/**
 * ============================================================================
 * ARCHIVAL INTRO CARD - MOBILE VARIANT
 * ============================================================================
 *
 * Static, depth-first experience for touch devices (pointer: coarse).
 *
 * DESIGN PHILOSOPHY:
 * Mobile doesn't mean "cut down" - it means "different priorities." Instead of
 * motion-based delight, we use static depth (layers, shadows, contrast) to
 * achieve the same archival museum-grade aesthetic.
 *
 * WHAT'S DIFFERENT FROM DESKTOP:
 * - NO cursor tracking: No cursor exists on touch devices
 * - NO magnetic buttons: No hover state to trigger attraction
 * - NO continuous animations: Battery preservation, instant feel
 * - NO staggered reveals: Single entrance or fully static
 * - Touch-friendly hit targets (44px minimum)
 * - Simplified DOM for faster parsing
 *
 * WHAT'S PRESERVED:
 * - Archival color palette and typography
 * - Layered depth through shadows and borders
 * - Grain overlay for material realism
 * - All content and information hierarchy
 * - Corner craftsmanship details
 *
 * ANIMATION RATIONALE:
 * Only one-time entrance animation (or none if reduced motion). This provides
 * orientation without continuous battery drain or cognitive load.
 *
 * PERFORMANCE PRIORITIES:
 * - Minimal DOM (simpler than desktop)
 * - No JS-driven animations
 * - CSS-only transitions (instant feedback)
 * - GPU-friendly static layers
 * ============================================================================
 */

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

// =============================================================================
// STATIC COMPONENTS (No motion, immediate render)
// =============================================================================

/**
 * Static Link - Touch-optimized anchor without magnetic effects.
 *
 * MOBILE OPTIMIZATION:
 * - No mousemove listeners (touch doesn't have continuous position)
 * - No RAF loops (saves battery)
 * - CSS :active state for instant tap feedback
 * - 44px minimum touch target (accessibility)
 */
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
// CONTENT RENDERER (Shared between static and animated)
// =============================================================================

/**
 * CardContent - Shared content structure for both static and animated versions.
 * This ensures content parity while allowing different wrappers for animation.
 */
function CardContent({ socials }: { socials: SocialLink[] }) {
  return (
    <main className={styles.card}>
      <div className={styles.matBorder}>
        <div className={styles.surface}>
          <div className={styles.gridMobile}>
            
            {/* TOP: Visual Anchor */}
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
                      sizes="100vw"
                    />
                  </div>
                </div>
                
                <div className={styles.imageCaption}>
                  <span className={styles.captionId}>ID: SHIWA.2024</span>
                  <span className={styles.captionSpec}>Type: Full Stack</span>
                </div>
              </div>
            </div>

            {/* BOTTOM: Information Architecture */}
            <div className={styles.contentColumn}>
              
              <header className={styles.header}>
                <div className={styles.metaRow}>
                  <span className={styles.index}>01</span>
                  <div className={styles.divider} />
                  <span className={styles.status}>Available for collaboration</span>
                </div>

                <h1 className={styles.name}>
                  <span>Shiva</span>
                  <span className={styles.nameAccent}>Pandey</span>
                </h1>

                <p className={styles.role}>
                  Software Engineer & Architect
                </p>
              </header>

              <div className={styles.contactBlock}>
                <div className={styles.contactLabel}>Contact</div>
                <StaticLink 
                  href="mailto:Shivapanday9616527173@gmail.com"
                  className={styles.emailLink}
                >
                  <span>Shivapanday9616527173@gmail.com</span>
                  <FaArrowUpRightFromSquare className={styles.linkIcon} aria-hidden />
                </StaticLink>
              </div>

              <div className={styles.socialBlock}>
                <div className={styles.contactLabel}>Connect</div>
                <div className={styles.socialGridMobile} role="list">
                  {socials.map((social) => (
                    <StaticLink 
                      key={social.id} 
                      href={social.href}
                      className={styles.socialLink}
                    >
                      <span className={styles.socialIcon}>{social.icon}</span>
                      <span className={styles.socialLabel}>{social.label}</span>
                    </StaticLink>
                  ))}
                </div>
              </div>

            </div>
          </div>

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

      {/* Corner Details */}
      <div className={`${styles.corner} ${styles.cornerTL}`} aria-hidden />
      <div className={`${styles.corner} ${styles.cornerTR}`} aria-hidden />
      <div className={`${styles.corner} ${styles.cornerBL}`} aria-hidden />
      <div className={`${styles.corner} ${styles.cornerBR}`} aria-hidden />
    </main>
  );
}

// =============================================================================
// STATIC VERSION (No animations)
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
// ANIMATED VERSION (One-time entrance)
// =============================================================================

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    }
  },
};

function AnimatedMobileCard({ socials }: MobileCardProps) {
  return (
    <div className={styles.container}>
      <motion.main 
        className={styles.card}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <div className={styles.matBorder}>
          <div className={styles.surface}>
            <motion.div 
              className={styles.gridMobile}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              
              {/* TOP: Visual Anchor */}
              <motion.div className={styles.visualColumn} variants={itemVariants}>
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
                        sizes="100vw"
                      />
                    </div>
                  </div>
                  
                  <div className={styles.imageCaption}>
                    <span className={styles.captionId}>ID: SHIWA.2024</span>
                    <span className={styles.captionSpec}>Type: Full Stack</span>
                  </div>
                </div>
              </motion.div>

              {/* BOTTOM: Information Architecture */}
              <div className={styles.contentColumn}>
                
                <header className={styles.header}>
                  <motion.div className={styles.metaRow} variants={itemVariants}>
                    <span className={styles.index}>01</span>
                    <div className={styles.divider} />
                    <span className={styles.status}>Available for collaboration</span>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <h1 className={styles.name}>
                      <span>Shiva</span>
                      <span className={styles.nameAccent}>Pandey</span>
                    </h1>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <p className={styles.role}>
                      Software Engineer & Architect
                    </p>
                  </motion.div>
                </header>

                <motion.div className={styles.contactBlock} variants={itemVariants}>
                  <div className={styles.contactLabel}>Contact</div>
                  <StaticLink 
                    href="mailto:Shivapanday9616527173@gmail.com"
                    className={styles.emailLink}
                  >
                    <span>Shivapanday9616527173@gmail.com</span>
                    <FaArrowUpRightFromSquare className={styles.linkIcon} aria-hidden />
                  </StaticLink>
                </motion.div>

                <motion.div className={styles.socialBlock} variants={itemVariants}>
                  <div className={styles.contactLabel}>Connect</div>
                  <div className={styles.socialGridMobile} role="list">
                    {socials.map((social) => (
                      <StaticLink 
                        key={social.id} 
                        href={social.href}
                        className={styles.socialLink}
                      >
                        <span className={styles.socialIcon}>{social.icon}</span>
                        <span className={styles.socialLabel}>{social.label}</span>
                      </StaticLink>
                    ))}
                  </div>
                </motion.div>

              </div>
            </motion.div>

            <motion.div 
              className={styles.statementSection}
              variants={itemVariants}
            >
              <div className={styles.statementBorder}>
                <p className={styles.statement}>
                  Building full-stack applications with design-first philosophy. 
                  Focused on production-ready systems, seamless user experiences, 
                  and architectural elegance. Preparing for GATE2027.
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Corner Details */}
        <div className={`${styles.corner} ${styles.cornerTL}`} aria-hidden />
        <div className={`${styles.corner} ${styles.cornerTR}`} aria-hidden />
        <div className={`${styles.corner} ${styles.cornerBL}`} aria-hidden />
        <div className={`${styles.corner} ${styles.cornerBR}`} aria-hidden />
      </motion.main>

      {/* Grain Overlay */}
      <div className={styles.grain} aria-hidden />
    </div>
  );
}

// =============================================================================
// MAIN EXPORT
// =============================================================================

/**
 * ArchivalIntroCardMobile - Touch-optimized static experience.
 *
 * Renders either static or animated version based on reduced motion preference.
 */
export default function ArchivalIntroCardMobile({ socials }: MobileCardProps) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <StaticMobileCard socials={socials} />;
  }

  return <AnimatedMobileCard socials={socials} />;
}
