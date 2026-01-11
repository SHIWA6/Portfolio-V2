"use client";

import React, { useRef, useState, useEffect, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";


/* ================= DATA ================= */

const LOGOS = [
  { name: "HTML5", id: "html5" },
  { name: "CSS3", id: "css" },
  { name: "JavaScript", id: "javascript" },
  { name: "React", id: "react" },
  { name: "Node.js", id: "node" },
  { name: "Git", id: "git" },
  { name: "MongoDB", id: "mongodb" },
  { name: "TailwindCSS", id: "tailwindcss" },
  
  { name: "Docker", id: "docker" },
  { name: "PostgreSQL", id: "postgresql" },
  { name: "GitHub", id: "github" },
  { name: "TypeScript", id: "typescript" },
  { name: "Python", id: "python" },
] as const;

type Logo = (typeof LOGOS)[number];
type Direction = "left" | "right";

/* ================= TYPES ================= */

interface SlideProps {
  direction: Direction;
  progress: MotionValue<number>;
  isMobile: boolean;
  reduceMotion: boolean;
}

/* ================= MAIN ================= */

export default function Projects(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  /* Mobile detection */
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    // Set initial value via the handler pattern to satisfy lint rules
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mql); // Initial check
    mql.addEventListener("change", handler as (e: MediaQueryListEvent) => void);
    return () => mql.removeEventListener("change", handler as (e: MediaQueryListEvent) => void);
  }, []);

  /* Pause animation when tab hidden */
  useEffect(() => {
    const onVisibility = () =>
      setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <section className={`py-16`}>
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 overflow-hidden"
      >
        {(["left", "right", "left"] as const).map((dir, i) => (
          <Slide
            key={i}
            direction={dir}
            progress={scrollYProgress}
            isMobile={isMobile}
            reduceMotion={!isVisible || !!reduceMotion}
          />
        ))}
      </div>
    </section>
  );
}

/* ================= SLIDE ================= */

const Slide = memo(
  ({
    direction,
    progress,
    isMobile,
    reduceMotion,
  }: SlideProps): React.ReactElement => {
    const multiplier = direction === "left" ? -1 : 1;
    const intensity = isMobile ? 80 : 200;

    const x = useTransform(
      progress,
      [0, 1],
      reduceMotion
        ? [0, 0]
        : [intensity * multiplier, -intensity * multiplier]
    );

    return (
      <motion.div
        style={{ x }}
        className="flex whitespace-nowrap py-6 will-change-transform"
        aria-hidden
      >
        <Phrase />
      </motion.div>
    );
  }
);

Slide.displayName = "Slide";

/* ================= PHRASE ================= */

const Phrase = memo((): React.ReactElement => (
  <div className="flex gap-8 items-center px-6 min-w-max">
    {LOGOS.map((logo) => (
      <Icon key={logo.id} logo={logo} />
    ))}
  </div>
));

Phrase.displayName = "Phrase";

/* ================= ICON ================= */

interface IconProps {
  logo: Logo;
}

const Icon = ({ logo }: IconProps): React.ReactElement => (
  <div className="relative group cursor-pointer flex items-center justify-center">
    <img
      src={`/images/${logo.id}.svg`}
      alt={logo.name}
      width={64}
      height={64}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="h-[64px] w-auto"
    />
    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
      {logo.name}
    </span>
  </div>
);
