# Piece 1 — Revisions Part 3: Statue Refinement & Section Layout Fix

## Context
This is a third targeted revision following successful completion of Piece 1, Piece 1 Revisions,
and Piece 2 Revisions. Reference `DESIGN.md` and the current codebase for full context.
Do not rebuild unrelated functionality or implement any features from later pieces.

## Scope

### 1. Statue Adjustments

The statue is currently positioned too high and too dark. Make the following three adjustments:

**Brightness:**
- The statue was heavily dimmed in the last revision to blend with the ambient museum lighting,
  but it has become too dark and no longer stands out as the focal point of the composition.
- Increase its brightness slightly so it reads clearly while still maintaining the dim museum
  aesthetic. It should be noticeably brighter than the paper balls but not overexposed.
- Suggested adjustment: reduce the current `brightness()` filter value slightly (e.g. if
  currently `brightness(0.50)`, try `brightness(0.65)–0.70`). Tune by eye — the goal is visual
  hierarchy: spotlight glow > statue > paper balls > gallery floor.

**Vertical Position:**
- The statue was raised in the last revision, but it has been moved too high and no longer sits
  naturally on the pedestal.
- Move it down slightly (roughly 5–10% lower than its current position) so it appears to rest
  properly on the pedestal base. Eyeball the balance against the back wall and spotlight.

**Scale:**
- Increase the statue's scale slightly so that its base (the pedestal it stands on) naturally
  covers or aligns with the point where the floor cracks originate (see `DESIGN.md` §3 for
  the crack layout). This ensures visual coherence when the crack animation is added later.
- A ~10–15% scale increase should be sufficient. Adjust by eye.

### 2. Section Layout — Full Viewport Sizing

Each section currently appears as a centered panel on the parchment background, not filling the
entire screen. This needs to change:

**Layout change:**
- Make every section (About, Skills & Certs, Projects, Experience, Domains of Study / Interest)
  occupy 100% width and 100% height of the browser viewport.
- Sections should be fullscreen, edge-to-edge, not centered or constrained to a smaller container.
- This is purely a layout/sizing change — preserve all existing styling, colors, typography,
  and visual hierarchy. Do not redesign the sections.

**Implementation:**
- Ensure each section container has `width: 100vw` and `height: 100vh`.
- Check that content inside each section (header, placeholder text, etc.) is still readable and
  properly positioned within the fullscreen viewport. Add padding or adjust container overflow
  if needed to keep content from being cut off or pressed against edges.
- Verify that scrolling between sections still works smoothly (Lenis scroll behavior should
  continue functioning).

### 3. Return to Gallery Button — Fix Scroll-Path Behavior

The "Return to Gallery" button currently works when a section is reached by clicking a paper
ball, but fails when the section is reached by scrolling.

**Problem:**
- The button's click handler likely only checks the `currentSection` state without also
  triggering a scroll action. When clicked after scrolling, the state updates but the page
  doesn't scroll back to the hero.

**Fix:**
- Ensure the "Return to Gallery" button both:
  1. Updates the `currentSection` Zustand store to `"gallery"` (or equivalent)
  2. Scrolls the page back to the top/hero section (use Lenis scroll-to or native `scrollIntoView`)
- Test both paths:
  - Click a paper ball → navigate to section → click "Return to Gallery" → should return to hero
  - Scroll to a section → click "Return to Gallery" → should return to hero
- The button behavior should be identical regardless of how the user reached the section.

## Build log
After completing this revision:
- Update `BUILD_LOG.md` with an entry describing the statue refinements, fullscreen section
  layout change, and the return button fix.
- Keep the piece status table updated.

## Acceptance criteria
- `npm run dev` runs with no console errors.
- Statue is noticeably brighter than before, sits lower on the pedestal, and is scaled so its
  base aligns with the crack origin point.
- All 5 sections occupy the full viewport (100vw × 100vh), edge-to-edge.
- "Return to Gallery" button works consistently from both click-navigation and scroll-navigation
  paths, scrolling the user back to the hero.
- Content within sections remains readable and properly positioned in fullscreen layout.
- Code committed with a Conventional Commits message, e.g.
  `fix(gallery): refine statue brightness/position/scale, fullscreen sections, return button consistency`

## After completing
Commit and summarize the changes. Flag any positioning/brightness tuning decisions you made
by eye, and await review before proceeding to Piece 3 (terminal component).
