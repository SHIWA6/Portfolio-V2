/**
 * ============================================================================
 * ARCHIVAL INTRO CARD - WRAPPER COMPONENT
 * ============================================================================
 *
 * Entry point that renders the appropriate variant based on device capability.
 *
 * ARCHITECTURE:
 * - Capability detection (pointer: fine/coarse) determines which variant to render
 * - Desktop variant: Cinematic motion, cursor tracking, magnetic buttons
 * - Mobile variant: Static depth, touch-optimized, minimal animations
 * - Shared: Design tokens, content, accessibility features
 *
 * HYDRATION SAFETY:
 * - Server renders nothing (null) to avoid hydration mismatch
 * - Client hydrates and renders appropriate variant
 * - useSyncExternalStore prevents synchronous setState warnings
 *
 * RENDERING STRATEGY:
 * - First render (SSR): null (prevents hydration mismatch)
 * - Hydration: Detect capability, render appropriate variant
 * - Updates: Re-render if capability changes (e.g., mouse connected)
 *
 * WHY CAPABILITY OVER VIEWPORT:
 * - iPad Pro with keyboard = coarse pointer (tablet UI)
 * - iPad Pro with Magic Mouse = fine pointer (desktop UI)
 * - Surface in tablet mode = coarse pointer (tablet UI)
 * - Viewport width can't distinguish these cases
 *
 * PERFORMANCE:
 * - Code-split variants load only what's needed
 * - Each variant optimized for its target platform
 * - No feature detection overhead in render path
 * ============================================================================
 */

"use client";

import React, { useMemo } from 'react';
import { SiLeetcode } from "react-icons/si";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa6";

import { SocialLink } from './shared/design-system';
import { useInteractionCapability, useMounted } from './shared/hooks';

// Dynamic imports for code splitting (optional optimization)
// import dynamic from 'next/dynamic';
// const ArchivalIntroCardDesktop = dynamic(() => import('./ArchivalIntroCardDesktop'));
// const ArchivalIntroCardMobile = dynamic(() => import('./ArchivalIntroCardMobile'));

// Synchronous imports for immediate availability
import ArchivalIntroCardDesktop from './ArchivalIntroCardDesktop';
import ArchivalIntroCardMobile from './ArchivalIntroCardMobile';

// =============================================================================
// SSR FALLBACK
// =============================================================================

/**
 * StaticCardContent - Server-renderable fallback.
 *
 * Renders a completely static version during SSR to prevent hydration
 * mismatches. This is the same content structure but without any
 * client-side interactivity or capability detection.
 */
function StaticFallback() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1100px',
        backgroundColor: '#161616',
        padding: '2px',
        borderRadius: '4px',
      }}>
        <div style={{
          backgroundColor: '#111111',
          padding: '3.427rem',
          borderRadius: '2px',
          minHeight: '400px',
        }}>
          {/* Placeholder for progressive loading */}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ArchivalIntroCard - Capability-aware wrapper component.
 *
 * DECISION LOGIC:
 * 1. Not mounted (SSR): Render static fallback or null
 * 2. Hover capable (pointer: fine): Render Desktop variant
 * 3. Touch only (pointer: coarse): Render Mobile variant
 *
 * @returns Appropriate variant based on device capability
 */
export default function ArchivalIntroCard() {
  // Hydration safety: Don't render until client-side
  const mounted = useMounted();
  
  // Capability detection: Determines which variant to render
  const { isHoverCapable } = useInteractionCapability();
  
  // Social links - memoized to prevent recreation
  const socials: SocialLink[] = useMemo(() => [
    { 
      id: 'github', 
      href: 'https://github.com/SHIWA6', 
      label: 'GitHub', 
      icon: <FaGithub aria-hidden /> 
    },
    { 
      id: 'linkedin', 
      href: 'https://www.linkedin.com/in/shiva-pandey-41978a308', 
      label: 'LinkedIn', 
      icon: <FaLinkedin aria-hidden /> 
    },
    { 
      id: 'leetcode', 
      href: 'https://leetcode.com/SHIWA6', 
      label: 'LeetCode', 
      icon: <SiLeetcode aria-hidden /> 
    },
    { 
      id: 'twitter', 
      href: 'https://x.com/testcricforlife', 
      label: 'Twitter', 
      icon: <FaTwitter aria-hidden /> 
    },
  ], []);

  // SSR safety: Render fallback until client-side hydration
  if (!mounted) {
    return <StaticFallback />;
  }

  // Capability-based rendering
  // isHoverCapable = hasPointer && !hasTouch
  // True for: mouse, stylus, precision touchpads
  // False for: finger touch, coarse pointers
  if (isHoverCapable) {
    return <ArchivalIntroCardDesktop socials={socials} />;
  }

  return <ArchivalIntroCardMobile socials={socials} />;
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ArchivalIntroCardDesktop, ArchivalIntroCardMobile };
export { useInteractionCapability, useMounted } from './shared/hooks';
export { content, colors, typography, spacing } from './shared/design-system';
