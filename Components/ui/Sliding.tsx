"use client";

import React, { useState } from "react";
import Link from "next/link";

// ============================================================================
// STYLES
// ============================================================================

const styles = `
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}
`;

// ============================================================================
// COMPONENT
// ============================================================================

const Sliding: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <style>{styles}</style>

      <Link
        href="/os"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Developer corner – open Mac interface"
        className="
          fixed bottom-0 left-0 z-50
          w-32 h-32
          cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-white/50
        "
        style={{
          clipPath: "polygon(0 100%, 100% 100%, 0 0)",
        }}
      >
        {/* Base triangle */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black transition-transform duration-500"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 0 0)",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />

        {/* Arrow */}
        <svg
          className="absolute bottom-8 left-4 w-12 h-12 text-white transition-all duration-500"
          style={{
            transform: isHovered
              ? "translate(-4px, 4px) rotate(-10deg)"
              : "translate(0, 0)",
            opacity: isHovered ? 1 : 0.7,
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5" className="animate-bounce-slow" />
          <path d="M5 12l7-7 7 7" />
        </svg>

        {/* Label */}
        <div
          className="absolute bottom-2 left-2 text-white font-mono text-[10px] tracking-wider transition-all duration-300"
          style={{
            opacity: isHovered ? 1 : 0.6,
            transform: isHovered ? "translateY(-2px)" : "translateY(0)",
          }}
        >
          developer&apos;s
          <br />
          corner
        </div>

        {/* Glow */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 transition-opacity duration-500"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 0 0)",
            opacity: isHovered ? 1 : 0,
          }}
        />
      </Link>
    </>
  );
};

export default Sliding;
