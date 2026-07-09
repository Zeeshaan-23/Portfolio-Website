"use client";

import styles from "./GrainOverlay.module.css";

/**
 * Full-viewport SVG film-grain / noise overlay.
 * Uses feTurbulence per DESIGN.md §2 Texture spec.
 * Pointer-events: none so it never blocks clicks.
 */
export default function GrainOverlay() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}
