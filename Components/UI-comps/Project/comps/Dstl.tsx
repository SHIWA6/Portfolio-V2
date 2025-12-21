"use client";

import React from "react";
import styles from "./style.module.scss";

/** PROJECT PROPS — Clean and local, no external type imports */
interface ProjectProps {
  index: number;
  title: string;
  description: string;
  link: string;
  techStack: readonly string[];
  manageModal: (active: boolean, index: number, x: number, y: number) => void;
}

const Projectss: React.FC<ProjectProps> = ({
  index,
  title,
  description,
  link,
  techStack,
  manageModal,
}) => {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <div
        className={styles.project}
        onMouseEnter={(e) => manageModal(true, index, e.clientX, e.clientY)}
        onMouseLeave={(e) => manageModal(false, index, e.clientX, e.clientY)}
      >
        {description && <p className={styles.description}>{description}</p>}

        <h2>{title}</h2>

        {techStack && (
          <p className={styles.techStack}>{techStack.join(", ")}</p>
        )}
      </div>
    </a>
  );
};

export default Projectss;
