"use client";
import React, { useRef, useEffect, useState, useMemo, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/* ================= TYPES ================= */
interface SlideItem {
  src: string;
  width: number;
  height: number;
  color: string;
  alt: string;
}
type SliderData = readonly SlideItem[];

/* ================= DATA ================= */
const slider1: SliderData = [
  {
    src: "/images/leetcode.webp",
    width: 763,
    height: 457,
    color: "#e3e5e7",
    alt: "DSA_GRIND",
  },
  {
src: "/images/github.webp",    width: 800,
    height: 500,
    color: "#e3e3e3",
    alt: "Github_profile",
  },
  {
    src: "/images/pulsetalk.webp",
    width: 400,
    height: 300,
    color: "#21242b",
    alt: "PulseTalk_SaaS",
  },
] as const;

const slider2: SliderData = [
  {
    src: '/images/os.webp',
    width: 400,
    height: 300,
    color: "#d7d4cf",
    alt: "Operating_System",
  },
  {
    src: "/images/Shivaa.webp",
    width: 800,
    height: 500,
    color: "#e5e0e1",
    alt: "Portfolio_Website",
  },
  {
    src: "/images/aivora-desk-img.webp",
    width: 800,
    height: 500,
    color: "#d4e3ec",
    alt: "Twitter_AI_bot",
  },
  {
    src: "/images/Screenshot 2025-09-28 150550.webp"
    ,width: 768,
    height: 495,
    color: "#e1dad6",
    alt: "AI_Assistent",
  },
] as const;

/* ================= MAIN ================= */
export default function SlidingImages(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [isInViewport, setIsInViewport] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Only animate when in viewport - CRITICAL for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibility = () =>
      setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const shouldAnimate = isVisible && isInViewport && !prefersReducedMotion;

  const x1: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    shouldAnimate ? [0, 150] : [0, 0]
  );
  const x2: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    shouldAnimate ? [0, -150] : [0, 0]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-24"
    >
      <InfiniteSlider 
        data={slider1} 
        x={x1} 
        direction="left" 
        duration={40} 
        isActive={shouldAnimate}
      />
      <InfiniteSlider 
        data={slider2} 
        x={x2} 
        direction="right" 
        duration={50} 
        isActive={shouldAnimate}
      />
    </div>
  );
}

/* ================= INFINITE SLIDER ================= */
interface InfiniteSliderProps {
  data: SliderData;
  x: MotionValue<number>;
  direction: "left" | "right";
  duration: number;
  isActive: boolean;
}

const InfiniteSlider = memo(function InfiniteSlider({
  data,
  x,
  direction,
  duration,
  isActive,
}: InfiniteSliderProps): React.ReactElement {
  // Memoize extended data to prevent recreation
  const extendedData = useMemo(() => [...data, ...data, ...data], [data]);
  
  // CSS animation class instead of Framer Motion animate prop
  const animationStyle = useMemo(() => {
    if (!isActive) return {};
    
    const totalWidth = data.length * 424; // 400px card + 24px gap
    return {
      animation: `slide-${direction} ${duration}s linear infinite`,
      '--slide-distance': `-${totalWidth}px`,
    } as React.CSSProperties;
  }, [isActive, direction, duration, data.length]);

  return (
    <div className="relative mb-8 last:mb-0 overflow-hidden">
      <motion.div
        style={{ x }}
        className="flex gap-6"
      >
        <div
          className="flex gap-6 flex-shrink-0"
          style={animationStyle}
        >
          {extendedData.map((item, index) => (
            <SlideCard key={`${item.src}-${index}`} item={item} />
          ))}
        </div>
      </motion.div>
      
      {/* CSS Keyframes injected once */}
      <style jsx>{`
        @keyframes slide-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(var(--slide-distance)); }
        }
        @keyframes slide-right {
          0% { transform: translateX(var(--slide-distance)); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
});

/* ================= SLIDE CARD ================= */
interface SlideCardProps {
  item: SlideItem;
}

const SlideCard = memo(function SlideCard({ item }: SlideCardProps): React.ReactElement {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="group relative flex-shrink-0 w-[400px] h-[250px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{ backgroundColor: item.color }}
    >
      {/* Skeleton loader */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}

      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
        width={item.width}
        height={item.height}
      />

      {/* Simple overlay on hover - no complex animations */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white font-medium text-base">
            {item.alt}
          </p>
        </div>
      </div>
    </div>
  );
});