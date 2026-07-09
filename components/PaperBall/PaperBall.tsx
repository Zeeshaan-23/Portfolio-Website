"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/store/navigationStore";
import type { SectionId } from "@/store/navigationStore";
import styles from "./PaperBall.module.css";

interface PaperBallProps {
  /** Which paper-ball sprite (1–5) */
  spriteIndex: 1 | 2 | 3 | 4 | 5;
  /** The section this ball navigates to */
  sectionId: SectionId;
  /** Human-readable label for the section */
  label: string;
  /** CSS left position (percentage or px) */
  left: string;
  /** CSS bottom position (percentage or px) */
  bottom: string;
  /** Optional size override in px (default 110) */
  size?: number;
}

export default function PaperBall({
  spriteIndex,
  sectionId,
  label,
  left,
  bottom,
  size = 110,
}: PaperBallProps) {
  const router = useRouter();
  const setCurrentSection = useNavigationStore(
    (state) => state.setCurrentSection
  );

  const handleClick = () => {
    if (!sectionId) return;
    setCurrentSection(sectionId);
    router.push(`/${sectionId}`);
  };

  return (
    <button
      id={`paper-ball-${sectionId}`}
      className={styles.wrapper}
      style={{ left, bottom }}
      onClick={handleClick}
      title={label}
      aria-label={`Navigate to ${label}`}
    >
      {/* Label tag that floats above on hover */}
      <span className={styles.label} aria-hidden="true">
        {label}
      </span>

      <div className={styles.ball} style={{ width: size, height: size }}>
        <Image
          src={`/assets/paper-ball-${spriteIndex}.png`}
          alt={`${label} section — crumpled paper ball`}
          width={size}
          height={size}
          style={{ objectFit: "contain" }}
          draggable={false}
          priority
        />
      </div>
    </button>
  );
}
