"use client";

import Macbook from "@/Components/ui/Macbook";
import Link from "next/link";

export default function OSPage() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <Macbook />
      <Link
        href="/"
        className="absolute top-4 right-4 z-[101] px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors"
        aria-label="Back to home"
      >
        ✕ Close
      </Link>
    </div>
  );
}
