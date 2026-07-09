"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useNavigationStore } from "@/store/navigationStore";
import type { SectionId } from "@/store/navigationStore";
import styles from "./section.module.css";

const SECTION_META: Record<
  string,
  { title: string; subtitle: string; command: string }
> = {
  about: {
    title: "About",
    subtitle: "Origin story. The human behind the archive.",
    command: "cat about.txt",
  },
  "skills-certs": {
    title: "Skills & Certs",
    subtitle: "Technologies, tools, and credentials on record.",
    command: "ls -la skills/",
  },
  projects: {
    title: "Projects",
    subtitle: "Artefacts recovered from the archive.",
    command: "cd projects",
  },
  experience: {
    title: "Experience",
    subtitle: "Roles held. Contributions made. Chapters closed.",
    command: "cat experience.log",
  },
  domains: {
    title: "Domains of Study",
    subtitle: "Fields of inquiry. Ongoing obsessions.",
    command: "ls -R interests/",
  },
};

const VALID_SECTIONS = Object.keys(SECTION_META) as SectionId[];

export default function SectionPage() {
  const params = useParams();
  const router = useRouter();
  const setCurrentSection = useNavigationStore(
    (state) => state.setCurrentSection
  );

  const slug = params.section as string;
  const meta = SECTION_META[slug];

  // Sync Zustand store when navigating directly via URL
  useEffect(() => {
    if (VALID_SECTIONS.includes(slug as SectionId)) {
      setCurrentSection(slug as SectionId);
    }
  }, [slug, setCurrentSection]);

  const handleBack = () => {
    setCurrentSection(null);
    router.push("/");
  };

  // Unknown section fallback
  if (!meta) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <p className={styles.mono}>$ cd {slug}</p>
          <p className={styles.mono}>
            <span className={styles.accent}>Error:</span> No such section.
          </p>
          <button id="back-to-gallery-404" className={styles.backBtn} onClick={handleBack}>
            ← return to gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id={`section-${slug}`} className={styles.page}>
      {/* Terminal-style command prompt at top */}
      <p className={styles.prompt}>
        <span className={styles.promptSymbol}>$</span>{" "}
        <span className={styles.promptCommand}>{meta.command}</span>
      </p>

      {/* Section title in serif */}
      <h1 className={styles.title}>{meta.title}</h1>

      {/* Subtitle in mono */}
      <p className={styles.subtitle}>{meta.subtitle}</p>

      {/* Placeholder content indicator */}
      <div className={styles.placeholder}>
        <span className={styles.cursor}>▊</span>
        <span className={styles.placeholderText}>
          [ content coming in piece 3 ]
        </span>
      </div>

      {/* Back button */}
      <button
        id={`back-to-gallery-${slug}`}
        className={styles.backBtn}
        onClick={handleBack}
      >
        ← return to gallery
      </button>
    </div>
  );
}
