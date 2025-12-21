"use client";

import React, { useRef, useState, useEffect, useMemo, type FC } from "react";
import { useInView, motion, type Variants } from "framer-motion";
import Script from "next/script";
import Image from "next/image";
import styles from "./style.module.scss";

const slideUp: Variants = {
  initial: { y: "120%" },
  open: (i: number) => ({
    y: "0%",
    transition: {
      duration: 0.5,
      delay: 0.02 * i,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
  closed: { y: "120%" },
};

const AboutPage: FC = () => {
  const phrase =
    "I'm Shiva Pandey, a Btech undergraduate from Munshiganj Institute of Technology, major in Computer Science & Engineering, with a passion for web development and scalable technologies. Proficient in C++, JavaScript, TypeScript, Python, React.js, Next.js, Node.js, and cloud services like AWS and Docker. Always eager to expand my skills and tackle new challenges, I'm actively seeking lucrative opportunities to leverage my tech expertise and drive impactful projects. Whether it's through creating seamless web experiences or exploring the future of decentralized applications Im excited to contribute to the tech landscape and grow alongside it.";

  const words = useMemo(() => phrase.split(" "), [phrase]);

  const description = useRef<HTMLDivElement>(null);
  const isInView = useInView(description, { once: true, margin: "-10%" });

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      ref={description}
      className={styles.description}
      id="about"
      style={{
        minHeight: "520px", // UPDATED -> safer CLS baseline
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <Script
          async
          src="//embed.typeform.com/next/embed.js"
          strategy="afterInteractive"
        />
      </div>

      <div className={styles.body}>
        <p aria-label={phrase}>
          {words.map((word, index) => (
            <span
              key={index}
              className={styles.mask}
              aria-hidden="true"
              style={{
                display: "inline-flex",
                overflow: "hidden",
                verticalAlign: "top",
                marginRight: "0.25em",
              }}
            >
              <motion.span
                variants={slideUp}
                custom={index}
                initial="initial"
                animate={isInView ? "open" : "closed"}
                style={{ display: "inline-block" }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>

        <div data-scroll data-scroll-speed={0.1} />
      </div>
    </div>
  );
};

export default  AboutPage;