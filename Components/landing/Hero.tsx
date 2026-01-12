"use client";

import SlidingImages from "../ui/Work";
import Projects from "../ui/Project";
import Header from "../ui/Header";
import Intro from "../ui/Intro";
import About from "../ui/About";
import Skill from "../ui/Skill";
import Sliding from "../ui/Sliding";
import Contact from "../ui/Contact";
import LocalTime from "../utils/Localtimes";

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full bg-black selection:bg-white/20 selection:text-white">
      {/* 🔥 DEVELOPER CORNER - Fixed at bottom-left */}
      <Sliding />
      
      <section className="relative z-10 w-full flex flex-col">
        
        <div className="top-0 left-0 w-full z-50 pointer-events-none px-6 py-4 mix-blend-screen">
          <LocalTime />
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto">
            <Header />
          </div>

          <div className="flex flex-col w-full space-y-12 md:space-y-16 lg:space-y-20 pb-10">
              
            <section className="w-full max-w-7xl mx-auto px-1 sm:px-6 lg:px-1">
              <Intro />
            </section>

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
