"use client";

import Image from "next/image";
import PaperBall from "@/components/PaperBall/PaperBall";
import GrainOverlay from "@/components/GrainOverlay/GrainOverlay";
import styles from "./GalleryScene.module.css";

/**
 * 5 nav sections — each maps to a paper ball sprite + floor position.
 * Positions (left, bottom) are percentage strings relative to the
 * gallery scene container. Balls are spread across the floor area
 * and kept clear of the statue center column (~35%–65% left).
 */
const PAPER_BALLS = [
  {
    spriteIndex: 1 as const,
    sectionId: "about" as const,
    label: "About",
    left: "14%",
    bottom: "12%",
    size: 115,
  },
  {
    spriteIndex: 2 as const,
    sectionId: "skills-certs" as const,
    label: "Skills & Certs",
    left: "28%",
    bottom: "22%",
    size: 85,
  },
  {
    spriteIndex: 3 as const,
    sectionId: "projects" as const,
    label: "Projects",
    left: "72%",
    bottom: "24%",
    size: 78,
  },
  {
    spriteIndex: 4 as const,
    sectionId: "experience" as const,
    label: "Experience",
    left: "84%",
    bottom: "15%",
    size: 110,
  },
  {
    spriteIndex: 5 as const,
    sectionId: "domains" as const,
    label: "Domains of Study",
    left: "36%",
    bottom: "14%",
    size: 105,
  },
] as const;

export default function GalleryScene() {
  return (
    <div className={styles.scene} id="gallery-scene">
      {/* ── Layer 1: Gallery background (wall + floor + built-in cracks) ── */}
      <div className={styles.bgLayer}>
        <Image
          src="/assets/gallery-background.png"
          alt="Dim museum gallery hall with glowing green floor cracks"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
          quality={95}
        />
      </div>

      {/* ── Layer 2: CSS spotlight cone over the statue ── */}
      <div className={styles.spotlight} aria-hidden="true" />

      {/* ── Layer 2b: Hero Name (Top-left display) ── */}
      <h1 className={styles.heroName}>
        <div>Zeeshaan</div>
        <div className={styles.secondLine}>Suhail Shaik</div>
      </h1>

      {/* ── Layer 3: Statue (plain image for Piece 1 — no ASCII split yet) ── */}
      <div className={styles.statueWrapper}>
        <Image
          src="/assets/statue/statue.png"
          alt="Classical Greek marble statue on a pedestal"
          width={500}
          height={750}
          className={styles.statueImage}
          priority
          quality={95}
        />
      </div>

      {/* ── Layer 4: Paper ball nav items (scattered on floor) ── */}
      {PAPER_BALLS.map((ball) => (
        <PaperBall
          key={ball.sectionId}
          spriteIndex={ball.spriteIndex}
          sectionId={ball.sectionId}
          label={ball.label}
          left={ball.left}
          bottom={ball.bottom}
          size={ball.size}
        />
      ))}

      {/* ── Layer 4b: Resume Scroll (clickable right wall element) ── */}
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.resumeScroll}
        title="Open Resume"
      >
        <Image
          src="/assets/resume-scroll.png"
          alt="Aged scroll representing resume"
          width={120}
          height={120}
          className={styles.resumeScrollImage}
        />
      </a>

      {/* ── Layer 5: Film-grain overlay (topmost, no pointer events) ── */}
      <GrainOverlay />
    </div>
  );
}
