# Build Log — Digital Antiquity

## Project Status

| # | Piece | Goal | Status |
|---|---|---|---|
| 1 | Static gallery layout (statue, spotlight, paper balls) | Core UX skeleton | ✅ |
| 2 | Scroll-based section navigation + fullscreen layout | Smooth scrolling & layout stubs | ✅ |
| 2a| Gallery enhancements (hero name, texture, footer, cursor + scrollbar) | Visual polish on hero & sections | ✅ |
| 2b| Scroll-stack / depth layering (gallery + all 5 sections stack sequentially) | Book-like scroll transition model | ✅ |
| 3 | Terminal component wired to same nav state | Second nav method works | ⬜ |
| 4 | Crack SVG + binary MotionPath animation | Hero animation layer 1 | ⬜ |
| 5 | ASCII-split statue effect (Three.js) | Hero animation layer 2 (hardest, do last) | ⬜ |
| 6 | Mobile fallback (pre-rendered statue image/video instead of live Three.js, `prefers-reduced-motion` check) | Perf/accessibility pass | ⬜ |

## Changelog

### 2026-07-12 (Piece 2a Revisions Part 4: Hero Name Typewriter Animation)
- Implemented **Hero Name Typewriter Animation**:
  * Created a custom React `useEffect` typing loop with custom `setTimeout` pacing to sequentially type and delete "Zeeshaan" and "Suhail Shaik".
  * Sequence: type line 1 (~80ms/char), pause (300ms), type line 2 (~80ms/char), hold complete (1.8s), delete line 2 (~50ms/char), pause (300ms), delete line 1 (~50ms/char), pause empty (600ms), and loop.
  * Added a CSS-styled `.cursor` with blink animation that attaches dynamically to the end of the active text line, continuing to blink through all pauses.
  * Enforced layout stability by rendering zero-width spaces (`\u200b`) when strings are empty, preventing vertical element height collapse or shifting.
  * Enhanced accessibility by adding `aria-label="Zeeshaan Suhail Shaik"` to the wrapper `h1` and `aria-hidden="true"` to inner animation blocks to support screen readers without reading the character-by-character typing loop.

### 2026-07-11 (Piece 2b: Scroll Stack)
- Implemented **Scroll Stack / Depth Layering**:
  * Configured CSS Sticky Stacking (`position: sticky; top: 0;`) and ordered `z-index` stacking values across the landing hero and all section pages.
  * Tied brightness and opacity transitions of inner sheet elements to active scroll offsets using a custom DOM-ref-linked Lenis event listener.
  * Updated in follow-up revision: Removed the outgoing section's scale-down animation (`1.0` -> `0.94`) so that outgoing pages stay stationary at full size and only dim as they are covered by the next page.
  * Achieved high-performance depth-layering transitions (dimming to `0.6` brightness and `0.7` opacity) without triggering React component re-renders.
  * **Fixed Return to Gallery Navigation Bug:**
    * Replaced element-based scroll targets in Lenis `scrollTo` calls with calculated numeric pixel targets (`0` for the hero scene, and `(index + 1) * window.innerHeight` for sub-sections). This bypasses sticky element bounding box calculation constraints where Lenis evaluated travel distance as `0`.
    * Removed `IntersectionObserver` active-section tracking to avoid hydration and layout shift race conditions. Implemented robust scroll-listener math-based section tracking inside the Lenis event handler to reliably update the active section state and URL path during manual scrolls.

### 2026-07-11 (Piece 2a Revisions Part 2)
- Refined **Hero Name**: 
  * Stacked text into two lines ("Zeeshaan" and "Suhail Shaik") and wrapped them in distinct `div` layers.
  * Shifted the name rightward (`left: 3.5rem` on desktop, `left: 2rem` on mobile) to introduce padding from the viewport margin.
  * Indented the second line by `2ch` using a left margin, aligning the "S" in "Suhail" directly under the midpoint boundary of the first and second "e" in "Zeeshaan".
  * Integrated **Minecraft.ttf** local font (added to `public/fonts/`) and updated CSS variables/declarations.
  * Dimmed the hero name and its text glow to `brightness(0.65)` for a smoother visual style, color-matched to the bright green floor cracks glow (`#ccff62`).
  * Placed the header behind the statue (`z-index: 1`) and shifted it down (`top: 1.5em`) to align its bottom margin just above the statue's raised elbow.
- Refined **Resume Scroll**: Positioned the scroll closer to the right viewport edge (`right: 4%` on desktop), dimmed it further at rest (`filter: brightness(0.45) saturate(0.80)`) to blend deep into the wall lighting, and set hover transition filters to include a slight brightening and acid-green drop-shadow glow.

### 2026-07-11 (Piece 2a Revisions)
- Implemented **Hero Name**: Added a three-line, monospace display ("Zeeshaan Suhail Shaik") in the top-left quadrant of the gallery scene with an acid-green text glow (`#39ff14`).
- Implemented **Crumpled Paper Background Overlay**: Configured a `paperCrumple` overlay for all 5 fullscreen page sections using `/assets/textures/paper-crumple.png` with a `multiply` blend-mode, `0.15` opacity, and custom CSS color-shift filter.
- Implemented **Resume Scroll Link**: Positioned a clickable resume scroll sprite on the right wall of the gallery, matching the paper balls in visual scale, with a hover scale/glow transition linking to the `/resume.pdf` file.
- Created **Monospace Footer**: Built a minimal, monospace three-column footer at the bottom of the page containing contact info, git/linkedin links (text-only hover glowing `[github]` and `[linkedin]`), and shell/comment style metadata.
- Fixed a pre-existing type compilation warning in `MainScrollContainer.tsx` where `.ref` was used instead of `.current` on React `useRef` hooks.

### 2026-07-10 (Piece 1 Revisions Part 3)

### 2026-07-09
- Scaffolded App Router project directly in root workspace.
- Configured Next.js image quality boundaries to support high-fidelity static renders.
- Connected Special Elite and JetBrains Mono fonts via Next.js Google Fonts wrapper.

### 2026-07-09 (Piece 1 Revisions)
- Swapped statue with a transparent, background-removed PNG asset and scaled it up by ~20%.
- Applied dimming filter and shadows to the statue and paper balls to integrate them into the museum's ambient light.
- Repositioned and resized the 5 paper balls to follow perspective rules and scatter organically.

### 2026-07-09 (Piece 1 Revisions Part 2)
- Added Lenis smooth scrolling and connected Intersection Observer to update `currentSection` Zustand state and URL paths in real-time.
- Moved all paper balls vertically upward to maintain viewport bottom margins.
- Elevated the statue higher on the pedestal and deepened its dimming filters to blend with ambient room tones.
- Built fullscreen parchment section panels beneath the hero for all 5 routes.

### 2026-07-10 (Piece 1 Revisions Part 3)
- Refined Greek statue visuals: increased image size by ~11%, lowered position to align base with floor crack origin, and increased brightness filter to `brightness(0.68)` for visual hierarchy.
- Updated vertically stacked sections to be completely fullscreen and edge-to-edge (100vw × 100vh), removing padding, border-radius, and box shadow constraints from `.paperSheet`.
- Fixed "Return to Gallery" behavior by introducing an `isProgrammatic` scrolling flag in `navigationStore` to coordinate state, scroll, and URL history updates, resolving scroll-fighting and scroll-path URL inconsistencies.
