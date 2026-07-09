# Piece 1 revision part2 — Scroll Navigation \& Gallery Adjustments

## Context

This revision follows successful completion of Piece 1 and Piece 1 Revisions (`PIECE1\_REVISIONS.md`).
Reference `DESIGN.md` and the current codebase for full context. This task focuses on three
targeted changes only — do not rebuild unrelated functionality or start implementing terminal,
cracks, ASCII effects, or mobile fallbacks.

**Note on build order:** This deviates slightly from the original plan in `DESIGN.md` §6. We are
adding scroll-based navigation (originally Piece 3) before terminal navigation (originally Piece 2).
The rationale: scroll nav is lighter and more fundamental to the "three nav methods" goal than
terminal; better to lock it in first and keep terminal as an independent enhancement on top.

## Scope

### 1\. Paper Ball Positioning — Viewport Adjustment

* **Do not change** the current positions or relative spacing of the 5 paper balls.
* Move the entire group of paper balls slightly upward so they sit comfortably visible within
the viewport, with at least 40–50px of margin from the bottom edge (not touching the bottom
of the screen).
* Preserve all rotations, size variations, drop shadows, and scatter arrangement.

### 2\. Statue Positioning \& Lighting

* Move the statue upward on the pedestal so it sits more naturally in the composition (roughly
10–15% higher than current placement, eyeballing against the back wall frame and spotlight).
* **Significantly reduce brightness:** the statue is currently too bright for a dim museum
setting. Apply a much heavier dimming filter than the current one so it reads as part of the
ambient darkness, similar in brightness/saturation to the paper balls. Suggested starting point:

```css
  filter: brightness(0.50) contrast(0.90) saturate(0.80);
  ```

  Tune by eye — the goal is for the spotlight glow (acid green tint) to be the *brightest*
thing on the statue, not the statue itself. The spotlight should feel like it's lighting the
statue up from darkness, not the statue being naturally bright.

* Do not change the statue's scale, asset, or spotlight glow color/intensity.

### 3\. Vertical Scroll Navigation (Major Feature)

Refactor the app layout to support scrolling through sections. This is the core of this revision.

**Layout:**

* The gallery hero (background + statue + spotlight + paper balls + terminal placeholder area)
remains at the top of the page and spans one full viewport height.
* Below it, arrange 5 full-screen sections stacked vertically, one per nav item (in this order):

  1. About
  2. Skills \& Certs
  3. Projects
  4. Experience
  5. Domains of Study / Interest
* Each section is `height: 100vh` and occupies the full viewport width. No horizontal scroll.

**Scroll behavior:**

* Users can scroll down to move through sections (using Lenis for smooth scroll, already a
dependency per `DESIGN.md` §5).
* Clicking a paper ball should:

  * Update the `currentSection` Zustand store (as it already does)
  * Smoothly scroll to the corresponding section's position on the page (use Lenis scroll-to
or native `scrollIntoView` with smooth behavior)
* Scrolling down should also update the `currentSection` store in real-time, so scrolling and
clicking stay in sync. Use GSAP ScrollTrigger or Intersection Observer to detect which
section is currently in view and update the store accordingly.
* Section visibility state drives any visual indicators (e.g. which paper ball is "active" or
highlighted, if you choose to add that later — but don't add it now, just wire up the state).

**Section content (placeholder for now):**

* Each section should have the yellowed old-paper background as described in `DESIGN.md` §2
(cream `#e6dcc0` with texture overlay, aged feel). This was part of Piece 3 in the original
plan, but having it here makes the scrolling feel complete even before we add real content.
* Display the section name as a header in the serif font (Special Elite / IM Fell English).
* For body content, use a simple placeholder (e.g. `<p>Coming soon...</p>` in monospace).
* Keep styling minimal — we're not building full section content yet, just the visual frame.

**Existing functionality preserved:**

* Paper ball clicks must continue to work and update state, not be replaced by scroll-only nav.
* The Zustand store shape and api remain unchanged.
* Gallery hero styling, spotlight, statue, all unchanged except for the positioning adjustments
above.

## Technical notes

* Use Lenis (already in deps per `DESIGN.md` §5) for smooth scrolling.
* Wire ScrollTrigger or Intersection Observer to update `currentSection` state as sections come
into view — whichever feels cleaner given your current setup.
* The layout shift (adding sections below the hero) may require adjusting the hero container's
styling (ensure it's `height: 100vh` exactly, not auto, so it takes up one full viewport).
* Test on desktop viewport only for this revision — mobile scroll behavior is handled in Piece 6
(mobile fallback). Don't optimize for mobile yet.

## Build log

After completing this revision:

* Create or update `BUILD\_LOG.md` with an entry describing the scroll nav wiring, statue/paper
positioning adjustments, and the section layout addition.
* Update the piece status table: mark Piece 1 as ✅ and note that Piece 2 (terminal) is next
(or update the table if reordering the roadmap).

## Acceptance criteria

* `npm run dev` runs with no console errors.
* Gallery hero is one full viewport height; 5 sections below it, each `100vh` tall, with
yellowed backgrounds and placeholder content.
* Scrolling down moves through sections, and the `currentSection` store updates to reflect
which section is in view.
* Clicking a paper ball smoothly scrolls to its section and updates the store — verified by
testing each of the 5 balls.
* Paper ball positioning has been moved upward (away from bottom edge) while preserving scatter
and arrangement.
* Statue has been moved upward and significantly darkened to match the dim museum aesthetic.
* Code committed with a Conventional Commits message, e.g.
`feat(nav): add scroll-based section navigation with fullscreen layout`

## After completing

Commit and summarize what was built, flag any design decisions you made on positioning by eye,
and await review before starting Piece 2 (terminal navigation) or any future pieces.

