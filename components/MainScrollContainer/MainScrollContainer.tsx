"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Lenis from "lenis";
import { useNavigationStore, SectionId } from "@/store/navigationStore";
import GalleryScene from "@/components/Gallery/GalleryScene";
import styles from "./MainScrollContainer.module.css";

interface SectionData {
  id: Exclude<SectionId, null>;
  title: string;
  subtitle: string;
  command: string;
}

const SECTIONS: SectionData[] = [
  {
    id: "about",
    title: "About",
    subtitle: "Origin story. The human behind the archive.",
    command: "cat about.txt",
  },
  {
    id: "skills-certs",
    title: "Skills & Certs",
    subtitle: "Technologies, tools, and credentials on record.",
    command: "ls -la skills/",
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Artefacts recovered from the archive.",
    command: "cd projects && ls -l",
  },
  {
    id: "experience",
    title: "Experience",
    subtitle: "Roles held. Contributions made. Chapters closed.",
    command: "cat experience.log",
  },
  {
    id: "domains",
    title: "Domains of Study",
    subtitle: "Fields of inquiry. Ongoing obsessions.",
    command: "ls -R interests/",
  },
];

export default function MainScrollContainer() {
  const params = useParams();
  const router = useRouter();
  const currentSection = useNavigationStore((state) => state.currentSection);
  const setCurrentSection = useNavigationStore((state) => state.setCurrentSection);

  const lenisRef = useRef<Lenis | null>(null);
  const isScrollingRef = useRef(false);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      gestureOrientation: "vertical",
    });

    lenisRef.ref = lenis; // Keep ref updated

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Expose lenis instance globally for scroll-to events
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  // Intersection Observer to update state & URL during scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.45, // Trigger when section is ~50% in view
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // If programmatically scrolling (clicking a ball), bypass observer URL updates
      if (isScrollingRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (id === "gallery-hero") {
            setCurrentSection(null);
            window.history.pushState(null, "", "/");
          } else if (id && id.startsWith("section-")) {
            const sectionSlug = id.replace("section-", "") as SectionId;
            setCurrentSection(sectionSlug);
            window.history.pushState(null, "", `/${sectionSlug}`);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe hero and sections
    const heroEl = document.getElementById("gallery-hero");
    if (heroEl) observer.observe(heroEl);

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(`section-${sec.id}`);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [setCurrentSection]);

  // Initial scroll-to if section route is loaded directly
  useEffect(() => {
    const initialSlug = params.section as string;
    if (initialSlug && lenisRef.ref) {
      const targetEl = document.getElementById(`section-${initialSlug}`);
      if (targetEl) {
        // Delay slightly to ensure layout / images are fully rendered
        setTimeout(() => {
          lenisRef.ref?.scrollTo(targetEl, { immediate: true });
        }, 150);
      }
    }
  }, [params.section]);

  // Trigger smooth scroll when currentSection is updated (e.g. paper ball click)
  useEffect(() => {
    if (!lenisRef.ref) return;

    if (currentSection === null) {
      const heroEl = document.getElementById("gallery-hero");
      if (heroEl) {
        isScrollingRef.current = true;
        lenisRef.ref.scrollTo(heroEl, {
          onComplete: () => {
            isScrollingRef.current = false;
          },
        });
      }
    } else {
      const targetEl = document.getElementById(`section-${currentSection}`);
      const currentScrollY = window.scrollY;
      const targetScrollY = targetEl?.getBoundingClientRect().top ?? 0;

      // Only scroll if we aren't already aligned near the target
      if (targetEl && Math.abs(targetScrollY) > 10) {
        isScrollingRef.current = true;
        lenisRef.ref.scrollTo(targetEl, {
          onComplete: () => {
            isScrollingRef.current = false;
          },
        });
      }
    }
  }, [currentSection]);

  return (
    <div className={styles.container}>
      {/* ── Gallery Hero Section (100vh) ── */}
      <section id="gallery-hero" className={styles.heroSection}>
        <GalleryScene />
      </section>

      {/* ── Individual Full-Screen Sections Stacked Vertically ── */}
      {SECTIONS.map((sec) => (
        <section
          key={sec.id}
          id={`section-${sec.id}`}
          className={styles.sectionPage}
        >
          {/* Scroll depth grounding: Cream paper panel */}
          <div className={styles.paperSheet}>
            {/* Aged paper subtle shadow/burn overlay */}
            <div className={styles.paperTexture} />

            <div className={styles.paperContent}>
              {/* Terminal command style trace */}
              <p className={styles.prompt}>
                <span className={styles.promptSymbol}>$</span> {sec.command}
              </p>

              {/* Section name header in Serif font */}
              <h2 className={styles.sectionTitle}>{sec.title}</h2>

              {/* Monospace subtitle details */}
              <p className={styles.sectionSubtitle}>{sec.subtitle}</p>

              <div className={styles.divider} />

              {/* Body placeholder */}
              <div className={styles.contentBody}>
                <span className={styles.cursor}>▊</span>
                <span className={styles.placeholderText}>
                  [ Content coming in piece 3. Use terminal commands or scroll nav to explore. ]
                </span>
              </div>

              {/* Return to gallery helper */}
              <button
                className={styles.returnBtn}
                onClick={() => setCurrentSection(null)}
              >
                ← Return to Gallery
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
