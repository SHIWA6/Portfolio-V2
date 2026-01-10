"use client";
import React from "react"

import {
  useEffect,
  useRef,
  type ReactElement,
} from "react";
import gsap from "gsap";

/* ================= TYPES ================= */

interface MagneticProps {
  children: ReactElement;
  strength?: number;
}

/* ================= COMPONENT ================= */

export default function Magnetic({
  children,
  strength = 0.35,
}: MagneticProps): JSX.Element {
  const magneticRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = magneticRef.current;
    if (!el) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Skip on touch devices
    if ("ontouchstart" in window) return;

    const xTo = gsap.quickTo(el, "x", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });

    const yTo = gsap.quickTo(el, "y", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });

    const handleMove = (e: MouseEvent): void => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      xTo(x * strength);
      yTo(y * strength);
    };

    const handleLeave = (): void => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  /* Clone child safely with ref */
  return React.cloneElement(children, {
    ref: magneticRef,
  });
}
