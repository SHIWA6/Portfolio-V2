"use client";
import React, { useRef, useEffect, useState } from "react";
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
    src: "/images/CHEF.webp",
    width: 763,
    height: 457,
    color: "#e3e5e7",
    alt: "Modern architecture design",
  },
  {
src: "/images/Screenshot 2025-08-28 012809.webp",    width: 800,
    height: 500,
    color: "#e3e3e3",
    alt: "Minimalist interior",
  },
  {
    src: "/images/Screenshot 2025-08-28 012715.webp",
    width: 800,
    height: 500,
    color: "#21242b",
    alt: "Urban landscape",
  },
] as const;

const slider2: SliderData = [
  {
    src: '/images/1.webp',
    width: 400,
    height: 300,
    color: "#d7d4cf",
    alt: "Creative workspace",
  },
  {
    src: "/images/Screenshot 2025-08-28 012742.webp",
    width: 800,
    height: 500,
    color: "#e5e0e1",
    alt: "Product showcase",
  },
  {
    src: "/images/2.webp",
    width: 800,
    height: 500,
    color: "#d4e3ec",
    alt: "Digital interface",
  },
  {
    src: "/images/Screenshot 2025-09-28 150550.webp"
    ,width: 768,
    height: 495,
    color: "#e1dad6",
    alt: "Brand identity",
  },
] as const;

/* ================= MAIN ================= */
export default function SlidingImages(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const handleVisibility = () =>
      setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const x1: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || !isVisible ? [0, 0] : [0, 150]
  );
  const x2: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || !isVisible ? [0, 0] : [0, -150]
  );
  const height: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.9],
    [50, 0]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-24 "
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />
      
      <InfiniteSlider data={slider1} x={x1} direction="left" duration={40} />
      <InfiniteSlider data={slider2} x={x2} direction="right" duration={50} />

      <motion.div
        style={{ height }}
        className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none"
      >
        <div className="w-[40vw] max-w-[500px] aspect-square rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-3xl" />
      </motion.div>
    </div>
  );
}

/* ================= INFINITE SLIDER ================= */
interface InfiniteSliderProps {
  data: SliderData;
  x: MotionValue<number>;
  direction: "left" | "right";
  duration: number;
}

function InfiniteSlider({
  data,
  x,
  direction,
  duration,
}: InfiniteSliderProps): React.ReactElement {
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Triple the data for seamless looping
  const extendedData = [...data, ...data, ...data];

  return (
    <div className="relative mb-8 last:mb-0 overflow-hidden">
      <motion.div
        style={{ x }}
        className="flex gap-6 will-change-transform"
      >
        <motion.div
          className="flex gap-6 flex-shrink-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          animate={
            prefersReducedMotion || isPaused
              ? {}
              : {
                  x: direction === "left" ? [0, -100 / 3 + "%"] : [0, 100 / 3 + "%"],
                }
          }
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration,
              ease: "linear",
            },
          }}
        >
          {extendedData.map((item, index) => (
            <SlideCard key={`${item.src}-${index}`} item={item} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ================= SLIDE CARD ================= */
interface SlideCardProps {
  item: SlideItem;
}

function SlideCard({ item }: SlideCardProps): React.ReactElement {
  const [imageLoaded, setImageLoaded] = useState(false);
  const aspectRatio = item.width / item.height;

  return (
    <div
      className="group relative flex-shrink-0 w-[400px] h-[250px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
      style={{ backgroundColor: item.color }}
    >
      {/* Skeleton loader */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}

      {/* Image container with fixed aspect ratio to prevent CLS */}
      <div
        className="relative w-full h-full"
        style={{
          aspectRatio: aspectRatio.toString(),
        }}
      >
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onLoad={() => setImageLoaded(true)}
          width={item.width}
          height={item.height}
        />

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Optional: Add title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-white font-medium text-lg drop-shadow-lg">
            {item.alt}
          </p>
        </div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </div>
    </div>
  );
}