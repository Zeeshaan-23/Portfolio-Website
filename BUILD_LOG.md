# Build Log — Digital Antiquity

## Project Status

| # | Piece | Goal | Status |
|---|---|---|---|
| 1 | Static gallery layout (statue, spotlight, paper balls) | Core UX skeleton | ✅ |
| 2 | Scroll-based section navigation + fullscreen layout | Smooth scrolling & layout stubs | ✅ |
| 2a| Gallery enhancements (hero name, texture, footer, cursor + scrollbar) | Visual polish on hero & sections | ✅ |
| 2b| Scroll-stack / depth layering (gallery + all 5 sections stack sequentially) | Book-like scroll transition model | ✅ |
| 3 | Terminal component wired to same nav state | Second nav method works | ✅ |
| 4 | Crack SVG + binary MotionPath animation | Hero animation layer 1 | ⬜ |
| 5 | ASCII-split statue effect (Three.js) | Hero animation layer 2 (hardest, do last) | ⬜ |
| 6 | Mobile fallback (pre-rendered statue image/video instead of live Three.js, `prefers-reduced-motion` check) | Perf/accessibility pass | ⬜ |

## Changelog

### 2026-07-14 (Piece 3 Revisions: Terminal Fixes + Cursor Sizing)
- Implemented five targeted improvements across the custom cursor and terminal:
  * Aligned the back-wall painting trigger hotspot bounds to the actual visual frame in `gallery-background.png` (using `left: 63.5%`, `top: 32.5%`, `width: 16.5%`, `height: 27%`).
  * Structured the terminal window to open exactly at the painting trigger bounds (coordinate-matched using `.getBoundingClientRect()`).
  * Implemented custom resizing logic via pointer events (bottom-right NWSE resize handle) so the window remains fully resizable and draggable.
  * Added the `clear` command and configured auto-clear on close to prevent scrollback state persistence across sessions.
  * Prevented terminal scroll events from bubbling up to Lenis using `data-lenis-prevent` and `e.stopPropagation()` event containment.
  * Cleaned up window header controls by removing non-functional minimize/maximize buttons, leaving only a working close control.
  * Reduced custom crosshair cursor overall dimensions from `24px` to `16px` for a sleeker visual aesthetic, and offset the hotspot coordinate mappings to `8 8` in `globals.css` to preserve perfect centering.

### 2026-07-14 (Piece 3: Terminal Component)
- Implemented **Draggable Floating Terminal Component**:
  * Created `store/terminalStore.ts` using Zustand to manage the terminal's open/close state.
  * Built `Terminal.tsx` overlay using React Portals to render the terminal directly inside `document.body` to bypass stacking context and ensure it always floats on top of the section scroll-stack.
  * Added custom pointer-events based dragging logic (`setPointerCapture`) on the window header for responsive drag operations on both desktop and mobile/touch devices.
  * Supported standard console commands: `help`, `whoami`, `ls`, `cd <section>` (e.g. `cd about`, `cd /`), and handled unrecognized command errors.
  * Coordinated `cd <section>` navigation with `isProgrammatic` state from `navigationStore` to transition seamlessly with Lenis smooth scrolling.
  * Resolved pre-existing and new React JSX comment linter warnings in `Footer.tsx` and removed unused router imports in `MainScrollContainer.tsx` and `PaperBall.tsx`.

### 2026-07-14 (Piece 16: Signboard Readability Improvements)
- Improved readability of the wooden signboards above the Resume scroll and Terminal painting:
  * Processed `Resume-board.png` and `Terminal-board.png` images using a custom YCbCr luminance point transformation to darken the text labels and brighten the wood texture.
  * Increased the CSS filter brightness from `brightness(0.52)` to `brightness(0.78)` in `GalleryScene.module.css` for clearer visibility.
  * Pushed all updates to GitHub.

### 2026-07-14 (Piece 2a Revisions Part 4: Hero Name Typewriter Animation)
- Implemented **Hero Name Typewriter Animation & Rotations**:
  * Created a custom React `useEffect` typing loop with custom `setTimeout` pacing to sequentially type, hold, and delete text strings.
  * Configured a rotation cycle alternating between Set 1: "Zeeshaan" (line 1) / "Suhail Shaik" (line 2), and Set 2: "Learning fast." (line 1) / "Building faster." (line 2).
  * Sequence pacing: typing at **~120ms per character** (slower, per revisions request), hold complete for **~1.8s**, deletion at **~50ms per character**, and empty pause for **~600ms** between phases.
  * Replaced the thin cursor with a **Linux-style block cursor** (`width: 0.12em` matching a period block thickness, `height: 0.45em` for half the text line height, aligned to the baseline) that blinks dynamically on the end of the active line.
  * Enforced layout stability by rendering zero-width spaces (`\u200b`) when strings are empty, preventing vertical element height collapse or shifting.
  * Configured conditional second-line indentation (using separate CSS classes) so that the tagline "Building faster." starts left-aligned with no indent, while the name "Suhail Shaik" maintains its 2ch indent.
  * Configured the quote set ("Learning fast." / "Building faster.") to display at **80% of the name's font-size** (`font-size: calc(var(--hero-name-font-size) * 0.8)`) using CSS custom properties for responsive scaling on all screens.
  * Adjusted the quote tagline `line-height` to `1.1` to resolve visual overlapping between the descender 'g' in line 1 and ascenders in line 2.
  * Enhanced accessibility by dynamically updating `aria-label` to match the active set's complete text, while keeping inner visual typewriter divs hidden from screen readers via `aria-hidden="true"`.


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
