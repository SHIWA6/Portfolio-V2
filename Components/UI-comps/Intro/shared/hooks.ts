/**
 * ============================================================================
 * SHARED HOOKS
 * ============================================================================
 *
 * Capability detection and interaction hooks used by both Desktop and Mobile
 * variants. These hooks are hydration-safe and use useSyncExternalStore for
 * Next.js compatibility.
 *
 * DESIGN RATIONALE:
 * - Capability detection > viewport detection (handles hybrid devices correctly)
 * - useSyncExternalStore prevents hydration mismatches
 * - RAF throttling caps updates to display refresh rate
 * - CSS custom properties for pointer tracking (zero React re-renders)
 * ============================================================================
 */

"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { CapabilityState, PointerPosition } from './design-system';

// =============================================================================
// CONSTANTS
// =============================================================================

/** SSR-safe default snapshot for hydration consistency */
const SERVER_SNAPSHOT: CapabilityState = Object.freeze({
  hasPointer: false,
  hasTouch: false,
  isHoverCapable: false,
});

// =============================================================================
// USE INTERACTION CAPABILITY
// =============================================================================

/**
 * Detects primary input method capability using CSS media queries.
 *
 * WHY THIS MATTERS:
 * Touch devices (pointer: coarse) should not receive hover-dependent effects
 * like magnetic buttons or cursor-following ambient light. These create
 * confusion when there's no cursor to follow.
 *
 * HYBRID DEVICE HANDLING:
 * Devices like Surface Pro or iPad with Magic Keyboard may report both fine
 * and coarse pointers. We prioritize pointer capability when both are present.
 *
 * HYDRATION SAFETY:
 * Uses useSyncExternalStore pattern to avoid synchronous setState in effects,
 * preventing React hydration warnings in Next.js.
 *
 * @returns CapabilityState with pointer/touch detection flags
 *
 * @example
 * const { isHoverCapable } = useInteractionCapability();
 * // isHoverCapable === true for desktop with mouse
 * // isHoverCapable === false for phones, tablets
 */
export function useInteractionCapability(): CapabilityState {
  const pointerRef = useRef<MediaQueryList | null>(null);
  const touchRef = useRef<MediaQueryList | null>(null);
  const snapshotRef = useRef<CapabilityState>(SERVER_SNAPSHOT);

  const subscribe = useCallback((callback: () => void) => {
    // Initialize media query lists
    pointerRef.current = window.matchMedia("(pointer: fine)");
    touchRef.current = window.matchMedia("(pointer: coarse)");

    const updateSnapshot = () => {
      const next: CapabilityState = {
        hasPointer: pointerRef.current?.matches ?? false,
        hasTouch: touchRef.current?.matches ?? false,
        isHoverCapable: (pointerRef.current?.matches ?? false) && !(touchRef.current?.matches ?? false),
      };

      // Only trigger update if values actually changed (prevents infinite loops)
      if (
        next.hasPointer !== snapshotRef.current.hasPointer ||
        next.hasTouch !== snapshotRef.current.hasTouch
      ) {
        snapshotRef.current = next;
        callback();
      }
    };

    // Initial sync
    updateSnapshot();

    // Listen for capability changes (e.g., connecting/disconnecting mouse)
    pointerRef.current.addEventListener("change", updateSnapshot);
    touchRef.current.addEventListener("change", updateSnapshot);

    return () => {
      pointerRef.current?.removeEventListener("change", updateSnapshot);
      touchRef.current?.removeEventListener("change", updateSnapshot);
    };
  }, []);

  const getSnapshot = useCallback(() => snapshotRef.current, []);
  const getServerSnapshot = useCallback(() => SERVER_SNAPSHOT, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// =============================================================================
// USE THROTTLED POINTER POSITION
// =============================================================================

/**
 * Tracks mouse/touch position with requestAnimationFrame throttling.
 *
 * PERFORMANCE OPTIMIZATION:
 * Raw mousemove events fire at 60-120Hz, causing React re-renders that create
 * jank. RAF throttling caps updates to display refresh rate (60Hz) and batches
 * reads/writes for GPU composition.
 *
 * CSS CUSTOM PROPERTIES PATTERN:
 * Instead of returning position for React state, this hook updates CSS custom
 * properties directly on the DOM. This bypasses React entirely for the
 * high-frequency updates, while still allowing React to control the low-
 * frequency enable/disable state.
 *
 * USAGE:
 * Used by Desktop variant for ambient light effect that follows cursor.
 * Mobile variant does not use this (no cursor to follow).
 *
 * @param enabled - Whether to track pointer position
 * @param targetRef - Optional ref to element for relative positioning
 * @returns Current pointer position as percentages (0-100)
 *
 * @example
 * const position = useThrottledPointerPosition(isHoverCapable);
 * // Returns { x: 45.2, y: 32.8 } representing cursor position as %
 */
export function useThrottledPointerPosition(
  enabled: boolean,
  targetRef?: React.RefObject<HTMLElement | null>
): PointerPosition {
  const [position, setPosition] = useState<PointerPosition>({ x: 50, y: 50 });
  const rafRef = useRef<number | null>(null);
  const positionRef = useRef<PointerPosition>({ x: 50, y: 50 });

  useEffect(() => {
    if (!enabled) return;

    const handlePointerMove = (e: PointerEvent) => {
      // Store latest position in ref (no re-render trigger)
      if (targetRef?.current) {
        const rect = targetRef.current.getBoundingClientRect();
        positionRef.current = {
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        };
      } else {
        positionRef.current = {
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        };
      }

      // Schedule update if not already pending (RAF throttling)
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setPosition(positionRef.current);
          rafRef.current = null;
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, targetRef]);

  return position;
}

// =============================================================================
// USE CSS POINTER TRACKING
// =============================================================================

/**
 * Updates CSS custom properties for pointer position without React re-renders.
 *
 * This is the preferred pattern for high-frequency pointer tracking because
 * CSS custom property updates are GPU-composited and don't trigger React
 * component re-renders or layout calculations.
 *
 * @param enabled - Whether tracking is active
 * @param propertyPrefix - Prefix for CSS custom properties (default: '--cursor')
 * @returns Ref to attach to target element
 *
 * @example
 * const containerRef = useCssPointerTracking(isHoverCapable);
 * // Updates --cursor-x and --cursor-y CSS properties on container
 * // Use in CSS: background: radial-gradient(circle at var(--cursor-x) var(--cursor-y), ...)
 */
export function useCssPointerTracking(
  enabled: boolean,
  propertyPrefix: string = '--cursor'
): React.RefObject<HTMLDivElement | null> {
  const elementRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const positionRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;

    const handlePointerMove = (e: PointerEvent) => {
      // Calculate position relative to viewport
      positionRef.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };

      // Schedule CSS update via RAF
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          element.style.setProperty(`${propertyPrefix}-x`, `${positionRef.current.x}%`);
          element.style.setProperty(`${propertyPrefix}-y`, `${positionRef.current.y}%`);
          rafRef.current = null;
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, propertyPrefix]);

  return elementRef;
}

// =============================================================================
// USE MOUNTED STATE (Hydration Safety)
// =============================================================================

/**
 * Tracks whether component has mounted (client-side only).
 *
 * Essential for Next.js hydration safety. Server renders static content,
 * client hydrates and enables interactive features.
 *
 * @returns boolean indicating if component is mounted on client
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {}, // No-op unsubscribe
    () => true,     // Client: always true after hydration
    () => false     // Server: always false during SSR
  );
}
