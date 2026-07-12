"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PaperBall from "@/components/PaperBall/PaperBall";
import GrainOverlay from "@/components/GrainOverlay/GrainOverlay";
import styles from "./GalleryScene.module.css";

const TEXT_SETS = [
  { line1: "Zeeshaan", line2: "Suhail Shaik", indentSecondLine: true, isQuote: false },
  { line1: "Learning fast.", line2: "Building faster.", indentSecondLine: false, isQuote: true },
];

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
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [activeLine, setActiveLine] = useState<1 | 2>(1);
  const [ariaLabel, setAriaLabel] = useState("Zeeshaan Suhail Shaik");
  const [indentSecondLine, setIndentSecondLine] = useState(true);
  const [isQuote, setIsQuote] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let timer: NodeJS.Timeout;
    let currentSetIndex = 0;

    const runLoop = async () => {
      const currentSet = TEXT_SETS[currentSetIndex];
      const target1 = currentSet.line1;
      const target2 = currentSet.line2;

      // Update screen reader text to match current set
      setAriaLabel(`${target1} ${target2}`);
      setIndentSecondLine(currentSet.indentSecondLine);
      setIsQuote(currentSet.isQuote);

      // Step 1: Type line 1
      setActiveLine(1);
      setText2("");
      for (let i = 0; i <= target1.length; i++) {
        if (isCancelled) return;
        setText1(target1.slice(0, i));
        if (i < target1.length) {
          await new Promise((resolve) => {
            timer = setTimeout(resolve, 120); // Decreased speed: ~120ms per character
          });
        }
      }

      // Step 2: Brief pause (~300ms)
      if (isCancelled) return;
      await new Promise((resolve) => {
        timer = setTimeout(resolve, 300);
      });

      // Step 3: Type line 2
      if (isCancelled) return;
      setActiveLine(2);
      for (let i = 0; i <= target2.length; i++) {
        if (isCancelled) return;
        setText2(target2.slice(0, i));
        if (i < target2.length) {
          await new Promise((resolve) => {
            timer = setTimeout(resolve, 120); // Decreased speed: ~120ms per character
          });
        }
      }

      // Step 4: Full hold with both lines complete (~1.8s)
      if (isCancelled) return;
      await new Promise((resolve) => {
        timer = setTimeout(resolve, 1800);
      });

      // Step 5: Delete "Suhail Shaik" (line 2 first)
      if (isCancelled) return;
      setActiveLine(2);
      for (let i = target2.length; i >= 0; i--) {
        if (isCancelled) return;
        setText2(target2.slice(0, i));
        if (i > 0) {
          await new Promise((resolve) => {
            timer = setTimeout(resolve, 50);
          });
        }
      }

      // Step 6: Brief pause (~300ms)
      if (isCancelled) return;
      setActiveLine(1);
      await new Promise((resolve) => {
        timer = setTimeout(resolve, 300);
      });

      // Step 7: Delete "Zeeshaan"
      if (isCancelled) return;
      for (let i = target1.length; i >= 0; i--) {
        if (isCancelled) return;
        setText1(target1.slice(0, i));
        if (i > 0) {
          await new Promise((resolve) => {
            timer = setTimeout(resolve, 50);
          });
        }
      }

      // Step 8: Brief pause at fully empty (~600ms)
      if (isCancelled) return;
      await new Promise((resolve) => {
        timer = setTimeout(resolve, 600);
      });

      // Switch to the next set in the cycle
      currentSetIndex = (currentSetIndex + 1) % TEXT_SETS.length;

      if (!isCancelled) {
        runLoop();
      }
    };

    runLoop();

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, []);

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
      <h1 className={`${styles.heroName} ${isQuote ? styles.quote : ""}`} aria-label={ariaLabel}>
        <div aria-hidden="true">
          {text1 || "\u200b"}
          {activeLine === 1 && <span className={styles.cursor} />}
        </div>
        <div className={`${styles.secondLine} ${indentSecondLine ? styles.indented : ""}`} aria-hidden="true">
          {text2 || "\u200b"}
          {activeLine === 2 && <span className={styles.cursor} />}
        </div>
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
