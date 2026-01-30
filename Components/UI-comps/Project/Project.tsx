"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import Projectss from "./comps/Dstl";
import { motion, Variants } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import Script from "next/script";

/** ---------- Types ---------- */

export interface ProjectItem {
  readonly title: string;
  readonly description: string;
  readonly src: string;
  readonly color: string;
  readonly link: string;
  readonly techStack: readonly string[];
}

interface ModalState {
  active: boolean;
  index: number;
}

/** * Matches the function signature required by the Project child component 
 */
export type ManageModalFn = (active: boolean, index: number, x: number, y: number) => void;

/** ---------- Data ---------- */

const projects: ReadonlyArray<ProjectItem> = [
  {
    title: "AIVORA-DESK",
    description: "A hybrid automation platform leveraging Next.js, Node.js, Python, Selenium, REST APIs, ChromeDriver, distributed execution.",
    src: "/images/aivora-desk-img.webp",
    color: "#FFC0bb ",
    link: "https://github.com/SHIWA6/Aivora-Desk",
    techStack: ["Next.js", "Node.js", "TypeScript", "TailwindCSS", "Python", "Selenium", "REST API", "WebSockets"],
  },
  {
    title: "PULSETALK",
    description: "A full-stack blazing-fast real-time chat app powered by Next.js, Node.js, Prisma, Redis, and Socket.io.",
    src: "/images/pulsetalk.webp",
    color: "#FFC0CB",
    link: "https://pulse-talk-l9dd.vercel.app/",
    techStack: ["NextJs", "TailwindCss", "TypeScript", "ExpressJS", "Socket.io", "Redis"],
  },
  { title: "EDGE-AI",
  description: "A voice assistant powered by AI, created with NEXT.js and the Gemini API, offering 98% precision in speech recognition and a response time of only 1.5 seconds."
  , src: "/images/Screenshot 2025-09-28 150550.webp",
  color: "#000000",
  link: "https://edge-ai-rho.vercel.app/",
  techStack: ["NextJs, TailwindCss, NodeJS, ExpressJS, GeminiAPI"]

 },
  {
    title: "Stakelytics",
    description:
      "A feature-rich React.js and Tailwind CSS application focused on delivering interactive game mechanics like Mines etc,"
   , src: "/images/image.webp",
    color: "#000000",
    link: "https://gamble-gains-nine.vercel.app/",
    techStack: ["React.js", "Tailwind css"],
  },
    {
     title: "Portfolio",
     description:
       "A modern, interactive portfolio website showcasing projects with dynamic animations and responsive design.",
     src: "/images/PORTFOLIO_WEB.webp",
     color: "#000000",
     link: "https://portfolio-v1-dusky-beta.vercel.app/",
    techStack: [ "NextJS, TailwindCss"],
   },


  {
    title: "CHEF-CLAUDE",
    description: "A sleek, interactive AI-based cooking assistant built with React and Vite. Chef Claude lets users input ingredients and generates customized recipe suggestions using LLMs like ClaudeAPI or Hugging Face models.",
    src:"/images/CHEF.webp",
    color:"#000000",
    link: "https://github.com/SHIWA6/CHEF_CLAUDE_10-06-2025"
    , techStack: ["React.js", "Claude AI"]
  }
  // ... other projects
];

/** ---------- Animations ---------- */

const scaleAnimation: Variants = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: {
    scale: 1,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    scale: 0,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
  },
};

/** ---------- Component ---------- */

export default function ProjectPage() {

  const [modal, setModal] = useState<ModalState>({ active: false, index: 0 });
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // DOM Refs
  const modalContainer = useRef<HTMLDivElement | null>(null);
  const cursor = useRef<HTMLDivElement | null>(null);
  const cursorLabel = useRef<HTMLDivElement | null>(null);

  // GSAP QuickSetter Refs
  const xMoveModal = useRef<gsap.QuickToFunc | null>(null);
  const yMoveModal = useRef<gsap.QuickToFunc | null>(null);
  const xMoveCursor = useRef<gsap.QuickToFunc | null>(null);
  const yMoveCursor = useRef<gsap.QuickToFunc | null>(null);
  const xMoveCursorLabel = useRef<gsap.QuickToFunc | null>(null);
  const yMoveCursorLabel = useRef<gsap.QuickToFunc | null>(null);

  // Detect mobile screens
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    update(mql); // Initial check via handler

    // Clean cross-browser event handling
    mql.addEventListener("change", update as (e: MediaQueryListEvent) => void);
    return () => mql.removeEventListener("change", update as (e: MediaQueryListEvent) => void);
  }, []);

  // GSAP Smooth Follow Logic
  useEffect(() => {
    if (isMobile) return;

    if (modalContainer.current) {
      xMoveModal.current = gsap.quickTo(modalContainer.current, "left", { duration: 0.5, ease: "power3" });
      yMoveModal.current = gsap.quickTo(modalContainer.current, "top", { duration: 0.5, ease: "power3" });
    }
    if (cursor.current) {
      xMoveCursor.current = gsap.quickTo(cursor.current, "left", { duration: 0.3, ease: "power3" });
      yMoveCursor.current = gsap.quickTo(cursor.current, "top", { duration: 0.3, ease: "power3" });
    }
    if (cursorLabel.current) {
      xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", { duration: 0.25, ease: "power3" });
      yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", { duration: 0.25, ease: "power3" });
    }

    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    let rafId: number;
    const loop = () => {
      xMoveModal.current?.(mouse.x);
      yMoveModal.current?.(mouse.y);
      xMoveCursor.current?.(mouse.x);
      yMoveCursor.current?.(mouse.y);
      xMoveCursorLabel.current?.(mouse.x);
      yMoveCursorLabel.current?.(mouse.y);
      
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  const manageModal: ManageModalFn = (active, index, x, y) => {
    if (!isMobile) {
      xMoveModal.current?.(x);
      yMoveModal.current?.(y);
    }
    setModal({ active, index });
  };

  return (
    <main className={styles.projects} id="work">
      <Script src="https://embed.typeform.com/next/embed.js" strategy="afterInteractive" />

      <h1 className={styles.h1}>Projects</h1>

      <div className={styles.body}>
        {projects.map((p, i) => (
          <Projectss 
            key={p.title} 
            index={i}
            title={p.title}
            description={p.description}
            link={p.link}
            techStack={p.techStack}
            manageModal={manageModal}
          />
        ))}
      </div>

      <motion.div
        ref={modalContainer}
        variants={scaleAnimation}
        initial="initial"
        animate={modal.active ? "enter" : "closed"}
        className={styles.modalContainer}
        style={{ pointerEvents: isMobile ? "none" : "auto" }}
      >
        <div className={styles.modalSlider} style={{ top: `${modal.index * -100}%` }}>
          {projects.map((p) => (
            <div key={`modal-${p.title}`} className={styles.modal} style={{ backgroundColor: p.color }}>
              <Image
                src={p.src}
                alt={`${p.title} preview`}
                width={380}
                height={250}
                loading="lazy"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {!isMobile && (
        <>           <motion.div
            ref={cursor}
            className={styles.cursor}
            variants={scaleAnimation}
            initial="initial"
            animate={modal.active ? "enter" : "closed"}
          />

          <motion.div
            ref={cursorLabel}
            className={styles.cursorLabel}
            variants={scaleAnimation}
            initial="initial"
            animate={modal.active ? "enter" : "closed"}
          >
            View
          </motion.div>
        </>
      )}
    </main>
  );
}