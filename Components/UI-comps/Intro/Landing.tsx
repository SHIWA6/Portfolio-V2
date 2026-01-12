"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { GlowingEffect } from '../../utils/glowing-effect';

import { SiLeetcode } from "react-icons/si";
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa6";
import styles from "./style.module.scss";

const IntroCard = () => {
  const [activeKey, setActiveKey] = useState('profile');
  
  // Logic: Auto-rotate sections
  const sections = useMemo(() => [
    { id: 'profile', duration: 2.5 },
    { id: 'name', duration: 2.0 },
    { id: 'badge', duration: 1.8 },
    { id: 'email', duration: 2.2 },
    { id: 'github', duration: 1.6 },
    { id: 'twitter', duration: 1.6 },
    { id: 'leetcode', duration: 1.6 },
    { id: 'linkedin', duration: 1.6 },
    { id: 'about', duration: 2.8 }
  ], []);

  useEffect(() => {
    const currentIndex = sections.findIndex(s => s.id === activeKey);
    const currentDuration = sections[currentIndex]?.duration || 2;
    
    const timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % sections.length;
      setActiveKey(sections[nextIndex].id);
    }, currentDuration * 1000);

    return () => clearTimeout(timer);
  }, [activeKey, sections]);

  // Helper to apply spotlight class safely
  const getSpotlightClass = (id: string) => 
    `${styles.spotlightWrapper} ${activeKey === id ? styles.spotlightTarget : ''}`;

  return (
    // OUTER CONTAINER:
    // 1. min-h-screen ensures full viewport height.
    // 2. py-8 ensures scrolling is possible on small screens with tall content.
    <div className=" flex flex-col items-center justify-center min-h-screen w-full p-4 py-8 overflow-hidden  bg-black/5">
       
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        // CARD CONTAINER:
        // 1. h-auto: Grows with content (crucial for mobile).
        // 2. pb-14: Reserves bottom space for absolute progress dots so they don't overlap text.
        // 3. pt-12 md:pt-8: Extra top padding on mobile to clear the TimeLocal absolute element.
        className="relative w-full max-w-[90vw] md:max-w-4xl mx-auto bg-[#181818] md:backdrop-blur-xl border border-white/20 rounded-3xl p-6 pt-12 md:p-8 pb-14 shadow-lg md:shadow-2xl flex flex-col justify-between"
      > 
        
        {/* --- Header Time (Absolute) --- */}
        {/* Placed top-4 right-4. text-xs for mobile, text-sm for desktop to prevent clipping. */}
       

        {/* --- Decorative Corners --- */}
        <div className="absolute top-4 left-4 w-4 h-4 md:w-6 md:h-6 border-l-2 border-t-2 border-white/50 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 md:w-6 md:h-6 border-r-2 border-t-2 border-white/50 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 md:w-6 md:h-6 border-l-2 border-b-2 border-white/50 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 md:w-6 md:h-6 border-r-2 border-b-2 border-white/50 rounded-br-lg pointer-events-none" />

        {/* --- Content Flex Wrapper --- */}
        {/* Stack Vertical on Mobile (flex-col), Horizontal on Desktop (md:flex-row) */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 relative z-10 w-full">
           
          {/* --- Profile Image --- */}
          {/* Flex-shrink-0 prevents image squashing. Centered on mobile by parent items-center. */}
          <div className={`relative group rounded-2xl shrink-0 ${getSpotlightClass('profile')}`}>
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-2 ring-white bg-black z-10 will-change-transform"
            > 
              <Image 
                src="/images/reall.webp"
                alt="Profile" 
                width={160} 
                height={160} 
                priority={true}
                className="w-full h-full object-cover"
                placeholder="empty" 
              />
              <div className="absolute inset-0 bg-line-to-t from-slate-900/40 to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* --- Text Details --- */}
          {/* w-full ensures it takes remaining width. text-center (mobile) -> text-left (desktop) */}
          <div className="flex-1 text-center md:text-left space-y-4 w-full min-w-0">
            
            <div className="space-y-3 flex flex-col items-center md:items-start">
              
              {/* Name */}
              <div className={`relative inline-block rounded-lg ${getSpotlightClass('name')}`}>
                 {/* text-3xl for small phones, 4xl for tablets, 6xl for desktop */}
                 <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tight relative z-10 min-h-[1.1em] leading-tight whitespace-nowrap">
                   Shiva
                 </h1>
              </div>
              
              {/* Badge */}
              <div className={`relative inline-block rounded-full ${getSpotlightClass('badge')}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-black border border-white backdrop-blur-sm"
                >
                  <div className="relative w-2.5 h-2.5 md:w-3 md:h-3 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-full h-full bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                    />
                  </div>
                  <span className="text-white font-bold text-xs md:text-sm whitespace-nowrap">Active</span>
                </motion.div>
              </div>
            </div>

            {/* Role */}
            <div className="min-h-8 flex items-center justify-center md:justify-start">
                <p className="text-lg md:text-2xl text-white font-light">
                Software Engineer
                </p>
            </div>

            {/* --- Email --- */}
            {/* max-w-full and break-all are CRITICAL for 320px screens with long emails */}
            <div className={`relative inline-block rounded-lg max-w-full ${getSpotlightClass('email')}`}>
                <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative z-10 flex items-center justify-center md:justify-start gap-2 md:gap-3 text-slate-300 group cursor-pointer py-1 px-2 rounded-lg"
                >
                <div className="w-4 h-4 md:w-5 md:h-5 shrink-0">
                    <FaEnvelope className="w-full h-full text-white group-hover:text-cyan-300 transition-colors" />
                </div>
                {/* Responsive text size: text-xs on mobile, text-lg on desktop */}
                <span className="text-xs sm:text-sm md:text-lg group-hover:text-white transition-colors break-all text-left">
                    Shivapanday9616527173@gmail.com
                </span>
                </motion.div>
            </div>

            {/* --- Social Links --- */}
            {/* flex-wrap ensures icons don't shrink below w-10 on tiny screens */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 pt-2 min-h-[50px]">
              <SocialIcon 
                id="github" 
                getSpotlightClass={getSpotlightClass}
                href="https://github.com/SHIWA6" 
                icon={<FaGithub className="w-5 h-5 md:w-6 md:h-6" />} 
              />
              <SocialIcon 
                id="twitter" 
                getSpotlightClass={getSpotlightClass}
                href="https://x.com/testcricforlife" 
                icon={<FaTwitter className="w-5 h-5 md:w-6 md:h-6" />} 
              />
              <SocialIcon 
                id="leetcode" 
                getSpotlightClass={getSpotlightClass}
                href="https://leetcode.com/SHIWA6" 
                icon={<SiLeetcode className="w-5 h-5 md:w-6 md:h-6" />} 
              />
              <SocialIcon 
                id="linkedin" 
                getSpotlightClass={getSpotlightClass}
                href="https://www.linkedin.com/in/shiva-pandey-41978a308" 
                icon={<FaLinkedin className="w-5 h-5 md:w-6 md:h-6" />} 
              />
            </div>
          </div>
        </div>

        {/* --- About Section --- */}
        {/* mt-8 spacing. w-full ensures full width. */}
        <div className={`relative w-full mt-8 md:mt-12 rounded-[1.25rem] ${getSpotlightClass('about')}`}>
            <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative z-10 p-5 md:p-6 rounded-[1.25rem] bg-slate-800/50 md:bg-slate-800/30 border-2 border-black/50 md:backdrop-blur-sm overflow-hidden"
            >
             {/* Background Glow */}
            <div className="absolute inset-0 z-0 rounded-[1.25rem]">
                 <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={2}
                />
            </div>
            
            <p className="relative z-20 text-white text-sm md:text-lg leading-relaxed text-center md:text-left">
                I build full-stack apps that matter with design-first, production-ready projects. 
                Passionate about creating seamless user experiences and innovative solutions. 
                A problem solver, Critical thinker and I&apos;m also preparing for GATE2027, Let&apos;s connect.
            </p>
            </motion.div>
        </div>

        {/* --- Progress Indicators --- */}
        {/* Fixed at absolute bottom. Parent padding (pb-14) ensures this never overlaps text. */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30 h-4 pointer-events-none">
          {sections.map((section) => (
            // pointer-events-auto re-enables clicking on the dots
            <div 
                key={section.id} 
                className="w-4 h-4 flex items-center justify-center cursor-pointer pointer-events-auto"
                onClick={() => setActiveKey(section.id)}
            >
                <motion.div
                initial={false}
                animate={{
                    scale: activeKey === section.id ? 1.5 : 1,
                    opacity: activeKey === section.id ? 1 : 0.4,
                    backgroundColor: activeKey === section.id ? '#45f045' : '#475569'
                }}
                transition={{ duration: 0.3 }}
                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                />
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
};

// Social Icon Sub-component
interface SocialIconProps {
  id: string;
  href: string;
  icon: React.ReactNode;
  getSpotlightClass: (id: string) => string;
}

const SocialIcon = ({ id, href, icon, getSpotlightClass }: SocialIconProps) => (
  <div className={`rounded-xl shrink-0 ${getSpotlightClass(id)}`}>
      <motion.a
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        href={href}
        // w-10 h-10 for mobile (touch target friendly), w-12 h-12 for desktop
        className="relative z-10  rounded-xl bg-black border border-white hover:border-cyan-500/50 transition-colors group w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
      >
        <div className="text-slate-300 group-hover:text-cyan-400 transition-colors">
            {icon}
        </div>
      </motion.a>
  </div>
);

export default IntroCard;