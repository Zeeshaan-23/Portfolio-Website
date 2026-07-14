# Task for Antigravity — Piece 3: Terminal Component

## Context
Read `DESIGN_UPDATED.md` first — §15 (Terminal) is the full spec for this task, with §4
(Navigation Model) and §12 (Decisions) referencing it too. Treat `DESIGN_UPDATED.md` as
authoritative; if anything here conflicts with it, `DESIGN_UPDATED.md` wins.

Also check `BUILD_LOG.md` for the current state of the nav/scroll system before touching
anything, specifically:
- `navigationStore`'s `currentSection` state and its `isProgrammatic` scroll-flag pattern
  (used by "Return to Gallery" to avoid fighting scroll) — `cd <section>` commands should
  use this same pattern, not invent a new one.
- Piece 2b's section tracking is **Lenis-listener + math-based scroll position**, not
  Intersection Observer (IO was removed during the Piece 2b build to fix a hydration/race
  bug) — don't assume IO is present anywhere in the current codebase.
- Piece 2b's scroll-stack (sticky sections, `z-index` layering, dim-in-place on outgoing
  sections) is live and must not be covered by the terminal at any point once it's open.

This is **Piece 3** — the terminal is the second (of three) navigation methods to be wired
in, alongside paper-ball clicks and scroll. **Scope this to the terminal component only.**
Do not touch section content (Piece 3a), the paper ball unfold animation (Piece 3b), the
crack/binary animation (Piece 4), the ASCII statue split (Piece 5), hero name, statue, paper
balls, resume scroll, footer, cursor, scrollbar, or the wooden signboards — all of that is
done and should not regress.

## Scope for this task

### 1. Command set (first pass — minimal, per §15)
- `help` — lists available commands
- `cd <section>` — navigates to a section, writing to the existing `currentSection` Zustand
  store exactly like a paper ball click does (`cd about`, `cd projects`, etc.)
- `ls` — lists the 5 navigable sections, styled like a directory listing
- `whoami` — prints a short identity line
- Unknown command → a short "command not found" style error line, in keeping with the
  terminal-oracle aesthetic (not a generic browser-console error)
- Deliberately excluded for this pass: `cat <section>`, `clear` — add later once this set
  works end-to-end

### 2. Open/close trigger
- Terminal starts **minimized/closed** on page load.
- Trigger: a back-wall photo frame hotspot (right side of the gallery, per §15/§3) opens it
  on click. Since real frame art isn't ready yet, use a subtle acid-green hover glow + the
  existing crosshair "active" cursor state (filled center dot) as the interactive cue — same
  treatment as paper balls and the resume scroll. No new visual asset needed; frame art can
  be swapped in later without touching click logic.
- Clicking the frame again, or the terminal's own minimize control, closes/minimizes it back
  down to the initial invisible state.

### 3. Window behavior
- **Draggable:** react-rnd or interact.js (per §5/§15) — draggable anywhere within the
  viewport after opening.
- **Style:** floating Mac-style window — title bar with traffic-light dots (plain colored
  circles are fine), monospace body (JetBrains Mono / IBM Plex Mono), acid-green text on
  near-black terminal background.
- **Shadow:** thin drop shadow (e.g. `box-shadow: 0 0 12px rgba(0,0,0,0.5)`) — this is the
  one deliberate exception to the site's general no-drop-shadow rule, since the terminal is
  meant to read as a physical floating object.
- **Position on open:** roughly front-and-center per the scene sketch — your call on exact
  resting position, just don't spawn it on top of the statue or fully off-screen.
- **Z-index — absolute top layer:** once open, the terminal must render above *everything*,
  including the Piece 2b scroll-stack layers. Render it via a **React portal** to a
  dedicated top-level DOM node (e.g. directly under `<body>`, sibling to the main scroll
  container), not inside the scroll-stack section tree — plain z-index won't survive the
  stacking contexts that scroll-stack's `transform`/`filter` animations create. Confirm this
  works against the current Piece 2b sticky/z-index setup before considering this done.
- **Minimize button:** explicit control in the title bar (can reuse traffic-light dot
  styling). Clicking it hides the terminal back to its initial state — in addition to, not
  instead of, the back-wall frame toggle.

### 4. State management
- Terminal open/closed state and command history are **UI state, not navigation state** —
  keep separate from `navigationStore` (a small dedicated store or local component state is
  fine). `cd <section>` still writes through to the existing `currentSection` store.
- Terminal open/close and drag position must not interfere with the existing
  `isProgrammatic` scroll-flag pattern used by "Return to Gallery" and the scroll-stack —
  the terminal floats independently of scroll position once open, and `cd <section>` should
  set that flag the same way a paper-ball click already does before triggering its scroll.

## Explicitly out of scope for this task
- Section content and components — carousels, timeline (Piece 3a)
- Paper ball unfold animation (Piece 3b)
- Crack SVG + binary MotionPath animation (Piece 4)
- ASCII-split statue effect (Piece 5)
- Mobile fallback (Piece 6)
- Hero name, statue, paper balls, resume scroll, footer, cursor, scrollbar, wooden
  signboards — already built, do not modify
- Additional terminal commands beyond the four listed (`cat`, `clear`, etc.)

## Acceptance criteria
- `npm run dev` runs cleanly with no console errors
- Terminal is invisible on page load; opens via clicking the back-wall frame hotspot with
  the crosshair active-cursor + glow cue on hover
- `help`, `cd <section>`, `ls`, `whoami` all work as specified; unknown commands produce a
  themed error line
- `cd <section>` updates the same `currentSection` store paper balls already use, and
  scrolls/transitions consistently with how a paper ball click behaves (coordinating with
  `isProgrammatic` so it doesn't fight the scroll-stack)
- Terminal is draggable anywhere in the viewport
- Terminal renders above every other layer at all times once open, including mid-scroll-
  stack-transition — verify by opening it and scrolling through all 5 sections
- Minimize button and the back-wall frame both independently close/reopen the terminal
- No regressions to any other completed piece (paper balls, scroll-stack, hero name, resume
  scroll, footer, cursor, scrollbar, signboards)
- Committed with clear, incremental Conventional Commits messages (e.g.
  `feat(terminal): add draggable terminal window`, `feat(terminal): wire cd/ls/help/whoami
  commands`, `fix(terminal): portal terminal above scroll-stack z-index`) — not one giant
  commit

## Build log
After completing this task, update `BUILD_LOG.md`:
- Add a changelog entry describing the terminal implementation, the portal/z-index approach
  used, and how `cd` was coordinated with `isProgrammatic`.
- Update the piece status table: mark Piece 3 as ✅.

## After completing
Summarize what you built, confirm the portal/z-index approach holds up against the
scroll-stack under test, flag any positioning/sizing decisions made by eye (terminal's
default resting position, frame hotspot bounds), and stop for review before starting Piece
3a (section content).
