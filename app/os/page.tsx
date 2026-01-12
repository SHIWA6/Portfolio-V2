"use client";

import Macbook from "@/Components/ui/Macbook";
import Link from "next/link";
import { useEffect } from "react";

export default function OSPage() {
  // Prevent viewport scaling issues on mobile
  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.inset = '0';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.inset = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      <Macbook />
      <Link
        href="/"
        className="absolute top-2 right-2 md:top-4 md:right-4 z-[101] px-3 py-1.5 md:px-4 md:py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-full text-xs md:text-sm font-medium transition-colors"
        aria-label="Back to home"
      >
        ✕ Close
      </Link>
    </div>
  );
}
