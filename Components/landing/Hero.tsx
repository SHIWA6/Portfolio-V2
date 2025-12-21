"use client"

import Image from "next/image" // Added for performance per instructions
import allbg from "./allbg.webp"
import Projects from "../ui/Project"
import Header from "../ui/Header"
import Intro from "../ui/Intro"
import About from "../ui/About"
import Skill from "../ui/Skill"
import Sliding from "../ui/Sliding"
import Contact from "../ui/Contact"
import LocalTime from "../utils/Localtimes";

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full bg-black selection:bg-white/20 selection:text-white">
      {/* FIXED BACKGROUND LAYER 
        Uses Next/Image with 'fill' for perfect optimization and zero CLS.
        The 'fixed' position creates a subtle parallax feel as content scrolls over it.
      */}
      <div className="fixed inset-0 z-0">
        <Image 
          src={allbg} 
          alt="Background" 
          fill 
          priority
          className="object-cover opacity-60" 
          sizes="100vw"
        />
        {/* Premium dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
      </div>

      {/* CONTENT LAYER 
        Relative positioning ensures this sits on top of the background.
      */}
      <section className="relative z-10 w-full flex flex-col">
        
        {/* Absolute positioned Time utility - kept out of flow but accessible */}
        <div className=" top-0 left-0 w-full z-50 pointer-events-none px-6 py-6 mix-blend-screen">
          <LocalTime />
        </div>

        <div className="w-full flex flex-col items-center">
          
          {/* Header Section */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header />
          </div>
          
          {/* MAIN CONTENT STACK
            Changed gap-2 to strict vertical rhythm (space-y). 
            Added responsive padding logic.
          */}
          <div className="flex flex-col w-full space-y-20 md:space-y-32 lg:space-y-40 pb-20">
            
            {/* Intro / Hero */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  md:pt-16">
              <Intro />
            </section>
            
            {/* About */}
            <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <About />
            </section>
            
            {/* Projects - Full width container, constrained content inside */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Projects />
            </section>

            {/* Skills */}
            <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <Skill />
            </section>

            {/* Sliding Text - Often looks best full bleed or wider */}
            <section className="w-full overflow-hidden">
              <Sliding />
            </section>

            {/* Contact */}
            <div className="w-full overflow-hidden border-t border-white/5 bg-black/20 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto">
                <Contact />
              </div>
            </div>
          
          </div>
        </div>

      </section>
    </div>
  )
}