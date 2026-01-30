"use client";

import dynamic from 'next/dynamic';
import Header from "../ui/Header";
import Intro from "../ui/Intro";
import LocalTime from "../utils/Localtimes";

// MOBILE PERFORMANCE: Dynamic imports for below-fold components
// These won't block initial render or LCP
const About = dynamic(() => import("../ui/About"), { 
  ssr: true,
  loading: () => <div className="min-h-[400px]" /> 
});

const Projects = dynamic(() => import("../ui/Project"), { 
  ssr: true,
  loading: () => <div className="min-h-[600px]" />
});

const Skill = dynamic(() => import("../ui/Skill"), { 
  ssr: true,
  loading: () => <div className="min-h-[400px]" />
});

const SlidingImages = dynamic(() => import("../ui/Work"), { 
  ssr: false // Desktop only, skip SSR entirely
});

const Contact = dynamic(() => import("../ui/Contact"), { 
  ssr: true,
  loading: () => <div className="min-h-[300px]" />
});

// Developer corner - defer on mobile (not critical for LCP)
const Sliding = dynamic(() => import("../ui/Sliding"), { 
  ssr: false 
});

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full bg-black selection:bg-white/20 selection:text-white">
      {/* 🔥 DEVELOPER CORNER - Fixed at bottom-left */}
      <Sliding />
      
      <section className="relative z-10 w-full flex flex-col">
        
        {/* MOBILE: Hide LocalTime initially - not critical for LCP */}
        <div className="hidden md:block top-0 left-0 w-full z-50 pointer-events-none px-6 py-4 mix-blend-screen">
          <LocalTime />
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto p-6">
            <Header />
          </div>

          <div className="flex flex-col w-full space-y-12 md:space-y-16 lg:space-y-20 pb-10">
              
            {/* ABOVE THE FOLD - LCP CRITICAL */}
            <section className="w-full max-w-7xl mx-auto px-1 sm:px-6 lg:px-1">
              <Intro />
            </section>

            {/* BELOW THE FOLD - dynamically loaded */}
            <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-1">
              <About />
            </section>

            <section className="w-full mx-auto px-4 sm:px-6 lg:px-8">
              <Projects />
            </section>

            <section className="w-full mx-auto px-4 sm:px-6 lg:px-8">
              <Skill />
            </section>
            
            {/* Sliding Images - Hidden on mobile for better performance and UX */}
            <section className="hidden md:block w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
              <SlidingImages />
            </section>
            
            <div className="w-full overflow-hidden border-t border-white/5 bg-black/40 md:bg-black/20 md:backdrop-blur-sm">
              <div className="max-w-7xl mx-auto">
                <Contact />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
