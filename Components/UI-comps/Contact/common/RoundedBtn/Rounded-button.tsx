"use client";

import React, {
  useEffect,
  useRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import gsap from "gsap";
import styles from "./style.module.scss";

/* ================= TYPES ================= */

interface RoundedButtonProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  backgroundColor?: string;
}

/* ================= COMPONENT ================= */

export default function RoundedButton({
  children,
  backgroundColor = "#455CE9",
  ...attributes
}: RoundedButtonProps): React.ReactElement {
  const circleRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Skip hover animation on touch devices
    if ("ontouchstart" in window) return;

    const tl = gsap.timeline({ paused: true });

    tl.to(
      circle,
      {
        top: "-25%",
        width: "150%",
        duration: 0.4,
        ease: "power3.in",
      },
      "enter"
    ).to(
      circle,
      {
        top: "-150%",
        width: "125%",
        duration: 0.25,
      },
      "exit"
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
      timelineRef.current = null;
    };
  }, []);

  const handleMouseEnter = (): void => {
    if (!timelineRef.current) return;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timelineRef.current.tweenFromTo("enter", "exit");
  };

  const handleMouseLeave = (): void => {
    if (!timelineRef.current) return;
    timeoutRef.current = window.setTimeout(() => {
      timelineRef.current?.play();
    }, 300);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed="false"
      className={styles.roundedButton}
      style={{ overflow: "hidden" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...attributes}
    >
      {children}
      <div
        ref={circleRef}
        className={styles.circle}
        style={{ backgroundColor }}
        aria-hidden
      />
    </div>
  );
}
