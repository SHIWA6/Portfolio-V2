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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for performance optimizations
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Logic: Auto-rotate sections - DISABLED on mobile for performance
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
    // MOBILE: Disable auto-rotation for better scroll performance
    if (isMobile) return;

    const currentIndex = sections.findIndex(s => s.id === activeKey);
    const currentDuration = sections[currentIndex]?.duration || 2;
    
    const timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % sections.length;
      setActiveKey(sections[nextIndex].id);
    }, currentDuration * 1000);

    return () => clearTimeout(timer);
  }, [activeKey, sections, isMobile]);

  // Helper to apply spotlight class safely - disabled on mobile
  const getSpotlightClass = (id: string) => {
    if (isMobile) return ''; // No spotlight on mobile
    return `${styles.spotlightWrapper} ${activeKey === id ? styles.spotlightTarget : ''}`;
  };

  return (
    // OUTER CONTAINER:
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 py-8 overflow-hidden bg-black/5">
       
      <motion.div
        initial={isMobile ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-[90vw] md:max-w-4xl mx-auto bg-[#181818] md:backdrop-blur-xl border border-white/20 rounded-3xl p-6 pt-12 md:p-8 pb-14 shadow-lg md:shadow-2xl flex flex-col justify-between"
      > 
        
        {/* --- Decorative Corners --- */}
        <div className="absolute top-4 left-4 w-4 h-4 md:w-6 md:h-6 border-l-2 border-t-2 border-white/50 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 md:w-6 md:h-6 border-r-2 border-t-2 border-white/50 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 md:w-6 md:h-6 border-l-2 border-b-2 border-white/50 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 md:w-6 md:h-6 border-r-2 border-b-2 border-white/50 rounded-br-lg pointer-events-none" />

        {/* --- Content Flex Wrapper --- */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 relative z-10 w-full">
           
          {/* --- Profile Image --- */}
          <div className={`relative group rounded-2xl shrink-0 ${getSpotlightClass('profile')}`}>
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-2 ring-white bg-black z-10">
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
            </div>
          </div>

          {/* --- Text Details --- */}
          <div className="flex-1 text-center md:text-left space-y-4 w-full min-w-0">
            
            <div className="space-y-3 flex flex-col items-center md:items-start">
              
              {/* Name */}
              <div className={`relative inline-block rounded-lg ${getSpotlightClass('name')}`}>
                 <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tight relative z-10 min-h-[1.1em] leading-tight whitespace-nowrap">
                   Shiva
                 </h1>
              </div>
              
              {/* Badge */}
              <div className={`relative inline-block rounded-full ${getSpotlightClass('badge')}`}>
                <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-black border border-white">
                  <div className="relative w-2.5 h-2.5 md:w-3 md:h-3 flex items-center justify-center">
                    <div className="w-full h-full bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                  </div>
                  <span className="text-white font-bold text-xs md:text-sm whitespace-nowrap">Active</span>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="min-h-8 flex items-center justify-center md:justify-start">
                <p className="text-lg md:text-2xl text-white font-light">
                Software Engineer
                </p>
            </div>

            {/* --- Email --- */}
            <div className={`relative inline-block rounded-lg max-w-full ${getSpotlightClass('email')}`}>
                <div className="relative z-10 flex items-center justify-center md:justify-start gap-2 md:gap-3 text-slate-300 group cursor-pointer py-1 px-2 rounded-lg">
                  <div className="w-4 h-4 md:w-5 md:h-5 shrink-0">
                      <FaEnvelope className="w-full h-full text-white" />
                  </div>
                  <span className="text-xs sm:text-sm md:text-lg break-all text-left">
                      Shivapanday9616527173@gmail.com
                  </span>
                </div>
            </div>

            {/* --- Social Links --- */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 pt-2 min-h-[50px]">
              <SocialIcon 
                id="github" 
                getSpotlightClass={getSpotlightClass}
                href="https://github.com/SHIWA6" 
                icon={<FaGithub className="w-5 h-5 md:w-6 md:h-6" />}
                isMobile={isMobile}
              />
              <SocialIcon 
                id="twitter" 
                getSpotlightClass={getSpotlightClass}
                href="https://x.com/testcricforlife" 
                icon={<FaTwitter className="w-5 h-5 md:w-6 md:h-6" />}
                isMobile={isMobile}
              />
              <SocialIcon 
                id="leetcode" 
                getSpotlightClass={getSpotlightClass}
                href="https://leetcode.com/SHIWA6" 
                icon={<SiLeetcode className="w-5 h-5 md:w-6 md:h-6" />}
                isMobile={isMobile}
              />
              <SocialIcon 
                id="linkedin" 
                getSpotlightClass={getSpotlightClass}
                href="https://www.linkedin.com/in/shiva-pandey-41978a308" 
                icon={<FaLinkedin className="w-5 h-5 md:w-6 md:h-6" />}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>

        {/* --- About Section --- */}
        <div className={`relative w-full mt-8 md:mt-12 rounded-[1.25rem] ${getSpotlightClass('about')}`}>
            <div className="relative z-10 p-5 md:p-6 rounded-[1.25rem] bg-slate-800/50 md:bg-slate-800/30 border-2 border-black/50 md:backdrop-blur-sm overflow-hidden">
             {/* Background Glow - ONLY on desktop */}
            {!isMobile && (
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
            )}
            
            <p className="relative z-20 text-white text-sm md:text-lg leading-relaxed text-center md:text-left">
                I build full-stack apps that matter with design-first, production-ready projects. 
                Passionate about creating seamless user experiences and innovative solutions. 
                A problem solver, Critical thinker and I&apos;m also preparing for GATE2027, Let&apos;s connect.
            </p>
            </div>
        </div>

        {/* --- Progress Indicators --- HIDDEN on mobile */}
        {!isMobile && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30 h-4 pointer-events-none">
            {sections.map((section) => (
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
        )}

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
  isMobile: boolean;
}

const SocialIcon = ({ id, href, icon, getSpotlightClass, isMobile }: SocialIconProps) => {
  // MOBILE: Simple link without motion animations
  if (isMobile) {
    return (
      <a
        href={href}
        className="rounded-xl bg-black border border-white w-10 h-10 flex items-center justify-center active:scale-95 transition-transform"
      >
        <div className="text-slate-300">{icon}</div>
      </a>
    );
  }

  return (
    <div className={`rounded-xl shrink-0 ${getSpotlightClass(id)}`}>
        <motion.a
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          href={href}
          className="relative z-10 rounded-xl bg-black border border-white hover:border-cyan-500/50 transition-colors group w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
        >
          <div className="text-slate-300 group-hover:text-cyan-400 transition-colors">
              {icon}
          </div>
        </motion.a>
    </div>
  );
};

export default IntroCard;