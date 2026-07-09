# Build Log — Digital Antiquity

## Project Status

| # | Piece | Goal | Status |
|---|---|---|---|
| 1 | Static gallery layout (statue, spotlight, paper balls) | Core UX skeleton | ✅ |
| 2 | Scroll-based section navigation + fullscreen layout | Smooth scrolling & layout stubs | ✅ |
| 3 | Terminal component wired to same nav state | Second nav method works | ⬜ |
| 4 | Crack SVG + binary MotionPath animation | Hero animation layer 1 | ⬜ |
| 5 | ASCII-split statue effect (Three.js) | Hero animation layer 2 (hardest, do last) | ⬜ |
| 6 | Mobile fallback (pre-rendered statue image/video instead of live Three.js, `prefers-reduced-motion` check) | Perf/accessibility pass | ⬜ |

## Changelog

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
