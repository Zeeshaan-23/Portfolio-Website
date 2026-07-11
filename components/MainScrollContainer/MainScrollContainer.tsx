"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Lenis from "lenis";
import { useNavigationStore, SectionId } from "@/store/navigationStore";
import GalleryScene from "@/components/Gallery/GalleryScene";
import Footer from "@/components/Footer/Footer";
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
  
  // Custom inner container DOM refs for scroll stack animations
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const sectionInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize Lenis smooth scroll & setup scroll stack animation listener
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      gestureOrientation: "vertical",
    });

    lenisRef.current = lenis; // Keep ref updated

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Expose lenis instance globally for scroll-to-element calls
    (window as any).lenis = lenis;

    // Handle book-style scroll stack transitions (dim & subtle scale down of outgoing sections)
    const handleScroll = () => {
      const scrollY = lenis.scroll;
      const vh = window.innerHeight || 1;

      // 1. Gallery Hero Inner Section (index 0)
      if (heroInnerRef.current) {
        const p = Math.max(0, Math.min(1, scrollY / vh));
        const scale = 1 - p * 0.03;      // Subtle scale 1.0 -> 0.97
        const brightness = 1 - p * 0.4;  // Dim brightness 1.0 -> 0.6
        const opacity = 1 - p * 0.3;     // Dim opacity 1.0 -> 0.7
        
        heroInnerRef.current.style.transform = `scale(${scale})`;
        heroInnerRef.current.style.filter = `brightness(${brightness})`;
        heroInnerRef.current.style.opacity = `${opacity}`;
      }

      // 2. Fullscreen Document Sections (indices 1 to SECTIONS.length)
      SECTIONS.forEach((sec, idx) => {
        const el = sectionInnerRefs.current[idx];
        if (el) {
          const startScroll = (idx + 1) * vh;
          const p = Math.max(0, Math.min(1, (scrollY - startScroll) / vh));
          const scale = 1 - p * 0.03;      // Subtle scale 1.0 -> 0.97
          const brightness = 1 - p * 0.4;  // Dim brightness 1.0 -> 0.6
          const opacity = 1 - p * 0.3;     // Dim opacity 1.0 -> 0.7
          
          el.style.transform = `scale(${scale})`;
          el.style.filter = `brightness(${brightness})`;
          el.style.opacity = `${opacity}`;
        }
      });

      // 3. Update active section state and URL based on current scroll position
      if (!isScrollingRef.current) {
        const activeIdx = Math.round(scrollY / vh);
        const activeSectionId = activeIdx === 0 ? null : SECTIONS[activeIdx - 1]?.id || null;
        
        const current = useNavigationStore.getState().currentSection;
        if (activeSectionId !== current) {
          setCurrentSection(activeSectionId);
          if (activeSectionId === null) {
            window.history.pushState(null, "", "/");
          } else {
            window.history.pushState(null, "", `/${activeSectionId}`);
          }
        }
      }
    };

    lenis.on("scroll", handleScroll);
    
    // Initial run after layout calculations complete
    const timer = setTimeout(handleScroll, 100);

    return () => {
      lenis.destroy();
      delete (window as any).lenis;
      clearTimeout(timer);
    };
  }, [setCurrentSection]);

  // Initial scroll-to if section route is loaded directly
  useEffect(() => {
    const initialSlug = params.section as string;
    if (initialSlug && lenisRef.current) {
      const index = SECTIONS.findIndex((s) => s.id === initialSlug);
      if (index !== -1) {
        const targetScroll = (index + 1) * window.innerHeight;
        // Delay slightly to ensure layout / images are fully rendered
        setTimeout(() => {
          lenisRef.current?.scrollTo(targetScroll, { immediate: true });
        }, 150);
      }
    }
  }, [params.section]);

  // Trigger smooth scroll when currentSection is updated programmatically (e.g. paper ball click)
  useEffect(() => {
    if (!lenisRef.current) return;

    const isProgrammatic = useNavigationStore.getState().isProgrammatic;
    if (!isProgrammatic) return;

    if (currentSection === null) {
      isScrollingRef.current = true;
      lenisRef.current.scrollTo(0, {
        onComplete: () => {
          isScrollingRef.current = false;
          useNavigationStore.getState().setProgrammatic(false);
          window.history.pushState(null, "", "/");
        },
      });
    } else {
      const index = SECTIONS.findIndex((s) => s.id === currentSection);
      if (index !== -1) {
        const targetScroll = (index + 1) * window.innerHeight;
        isScrollingRef.current = true;
        lenisRef.current.scrollTo(targetScroll, {
          onComplete: () => {
            isScrollingRef.current = false;
            useNavigationStore.getState().setProgrammatic(false);
            window.history.pushState(null, "", `/${currentSection}`);
          },
        });
      }
    }
  }, [currentSection]);

  const handleReturnToGallery = () => {
    useNavigationStore.getState().setProgrammatic(true);
    setCurrentSection(null);
  };

  return (
    <div className={styles.container}>
      {/* ── Gallery Hero Section (100vh) ── */}
      <section id="gallery-hero" className={styles.heroSection} style={{ zIndex: 1 }}>
        <div ref={heroInnerRef} style={{ width: "100%", height: "100%", willChange: "transform, filter, opacity" }}>
          <GalleryScene />
        </div>
      </section>

      {/* ── Individual Full-Screen Sections Stacked Vertically ── */}
      {SECTIONS.map((sec, idx) => (
        <section
          key={sec.id}
          id={`section-${sec.id}`}
          className={styles.sectionPage}
          style={{ zIndex: idx + 2 }}
        >
          {/* Scroll depth grounding: Cream paper panel */}
          <div
            ref={(el) => {
              sectionInnerRefs.current[idx] = el;
            }}
            className={styles.paperSheet}
            style={{ willChange: "transform, filter, opacity" }}
          >
            {/* Aged paper subtle shadow/burn overlay */}
            <div className={styles.paperTexture} />

            {/* Crumpled paper texture overlay */}
            <div className={styles.paperCrumple} />

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
                onClick={handleReturnToGallery}
              >
                ← Return to Gallery
              </button>
            </div>
          </div>
        </section>
      ))}

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
