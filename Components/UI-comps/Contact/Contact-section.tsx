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

interface ContactLink {
  label: string;
  href: string;
  icon: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

/* ================= DATA ================= */

const CONTACT_LINKS: ContactLink[] = [
  {
    label: "shivapanday7172@gmail.com",
    href: "mailto:shivapanday7172@gmail.com",
    icon: "📧",
  },
  {
    label: "+91 9214639099",
    href: "tel:+919214639099",
    icon: "📱",
  },
  {
    label: "Download Resume",
    href: "/resume.pdf",
    icon: "📄",
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/SHIWA6",
    icon: "💻",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/shiva-pandey-41978a308",
    icon: "💼",
  },
  {
    name: "Twitter",
    href: "https://x.com/TechCricforlife",
    icon: "🐦",
  },
];

/* ================= MAIN COMPONENT ================= */

export default function ContactSection(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  useEffect(() => {
    const onVisibility = () =>
      setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const y: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || !isVisible ? [0, 0] : [-100, 0]
  );

  const rotate: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || !isVisible ? [0, 0] : [120, 90]
  );

  const opacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.5, 1]
  );

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.section
      ref={containerRef}
      style={{ y }}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
        {/* Hero Section */}
        <motion.div
          style={{ opacity }}
          className="mb-20 md:mb-32"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 mb-12">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative shrink-0"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                {/* Skeleton loader */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-gray-900 rounded-full animate-pulse" />
                )}
                
                {/* Image container with fixed aspect ratio */}
                <div className="absolute inset-0 rounded-full overflow-hidden ring-4 ring-white/20 ring-offset-4 ring-offset-black">
                  <img
                    src="/images/reall.webp"
                    alt="Shiwa Pandey - Full Stack Developer"
                    width={192}
                    height={192}
                    loading="eager"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover grayscale transition-all duration-700 ${
                      imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                  />
                </div>

                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255, 255, 255, 0.2)",
                      "0 0 40px rgba(255, 255, 255, 0.3)",
                      "0 0 20px rgba(255, 255, 255, 0.2)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>

            {/* Title */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-4">
                  Let&apos;s work
                  <br />
                  <span className="relative inline-block">
                    <span className="relative z-10">together</span>
                    <motion.span
                      className="absolute bottom-2 left-0 w-full h-3 bg-white"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </span>
                </h2>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
                  Have a project in mind? Let&apos;s create something amazing together.
                  I&apos;m always open to discussing new opportunities.
                </p>
              </motion.div>
            </div>

            {/* Animated Arrow */}
            <motion.div
              style={{ rotate }}
              className="hidden lg:block"
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 9 9"
                fill="none"
                className="text-white"
              >
                <path
                  d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
                  fill="currentColor"
                />
              </svg>
            </motion.div>
          </div>

          {/* Contact Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            {CONTACT_LINKS.map((link, index) => (
              <ContactButton
                key={index}
                link={link}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          style={{ opacity }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16"
        >
          {/* Version */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-3"
          >
            <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">
              Version
            </h3>
            <p className="text-white text-xl font-medium">
              2025 © SHIWA
            </p>
            <p className="text-gray-600 text-sm">
              Built with Next.js & Framer Motion
            </p>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="space-y-3"
          >
            <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-4">
              Socials
            </h3>
            <div className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((social, index) => (
                <SocialLink
                  key={index}
                  social={social}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <StatItem label="Projects Completed" value="25+" />
              <StatItem label="Years Experience" value="3+" />
              <StatItem label="Happy Clients" value="15+" />
            </div>
          </motion.div>
        </motion.div>

        {/* Back to Top Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex justify-center"
        >
          <BackToTopButton onClick={scrollToTop} />
        </motion.div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </motion.section>
  );
}

/* ================= CONTACT BUTTON ================= */

interface ContactButtonProps {
  link: ContactLink;
  delay: number;
}

function ContactButton({ link, delay }: ContactButtonProps): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full overflow-hidden transition-all duration-300 hover:bg-white hover:border-white cursor-pointer min-h-[60px]"
    >
      {/* Background on hover */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon */}
      <span className={`text-2xl shrink-0 relative z-10 transition-all duration-300 ${isHovered ? 'grayscale-0' : ''}`}>
        {link.icon}
      </span>

      {/* Text */}
      <span className={`font-medium text-sm md:text-base whitespace-nowrap relative z-10 transition-colors duration-300 ${isHovered ? 'text-black' : 'text-white'}`}>
        {link.label}
      </span>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12"
        initial={{ x: "-200%" }}
        animate={{ x: isHovered ? "200%" : "-200%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.a>
  );
}

/* ================= SOCIAL LINK ================= */

interface SocialLinkProps {
  social: SocialLink;
  delay: number;
}

function SocialLink({ social, delay }: SocialLinkProps): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 cursor-pointer"
    >
      <motion.span
        className="text-xl"
        animate={{
          scale: isHovered ? 1.2 : 1,
          rotate: isHovered ? 10 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {social.icon}
      </motion.span>
      <span className="text-lg font-medium relative">
        {social.name}
        <motion.span
          className="absolute -bottom-1 left-0 h-0.5 bg-white"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : 0 }}
          transition={{ duration: 0.3 }}
        />
      </span>
    </motion.a>
  );
}

/* ================= STAT ITEM ================= */

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white font-bold text-lg">{value}</span>
    </div>
  );
}

/* ================= BACK TO TOP BUTTON ================= */

interface BackToTopButtonProps {
  onClick: () => void;
}

function BackToTopButton({ onClick }: BackToTopButtonProps): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative px-10 py-5 bg-white rounded-full overflow-hidden cursor-pointer shadow-lg hover:shadow-white/30 transition-all duration-300 min-h-[64px]"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 bg-white rounded-full blur-xl opacity-0"
        animate={{
          opacity: isHovered ? 0.3 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-3 text-black font-bold text-lg">
        <motion.span
          animate={{
            y: isHovered ? -5 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          ↑
        </motion.span>
        Back to Top
      </span>

      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -skew-x-12"
        initial={{ x: "-200%" }}
        animate={{ x: isHovered ? "200%" : "-200%" }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}