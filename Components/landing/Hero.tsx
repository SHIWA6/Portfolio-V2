"use client";

import { useState } from "react";
import Image from "next/image";
import SlidingImages from "../ui/Work";

import allbg from "./allbg.webp";
import Projects from "../ui/Project";
import Header from "../ui/Header";
import Intro from "../ui/Intro";
import About from "../ui/About";
import Skill from "../ui/Skill";
import Sliding from "../ui/Sliding";
import Contact from "../ui/Contact";
import LocalTime from "../utils/Localtimes";
import Macbook from "../ui/Macbook";

export default function Hero() {
  const [showMac, setShowMac] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-black selection:bg-white/20 selection:text-white">
      
      

      {/* MACBOOK OVERLAY */}
      {showMac && (
        <div className="fixed inset-0 z-[100] bg-black">
          <Macbook onClose={() => setShowMac(false)} />
        </div>
      )}

      {/* CONTENT */}
      {!showMac && (
        <section className="relative z-10 w-full flex flex-col">
          
          <div className="top-0 left-0 w-full z-50 pointer-events-none px-6 py-6 mix-blend-screen">
            <LocalTime />
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-7xl mx-auto">
              <Header />
            </div>

            <div className="flex flex-col w-full space-y-20 md:space-y-32 lg:space-y-40 pb-10">
              
              <section className="w-full max-w-7xl mx-auto px-1 sm:px-6 lg:px-1 md:pt-1">
                <Intro />
              </section>

              <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-1">
                <About />
              </section>

              <section className="w-full  mx-auto px-4 sm:px-6 lg:px-8">
                <Projects />
              </section>

              <section className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <Skill />
              </section>

              {/* 🔥 DEVELOPER CORNER */}
              <section className="w-full overflow-hidden">
                <Sliding onClick={() => setShowMac(true)} />
              </section>
              <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <SlidingImages/>
              </section>
              <div className="w-full overflow-hidden border-t border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                  <Contact />
                </div>
              </div>

            </div>
          </div>
        </section>
      )}
    </div>
  );
}
