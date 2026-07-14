# Task for Antigravity — Piece 2a Revisions, Part 4: Hero Name Typewriter Animation

## Context
Read `DESIGN_UPDATED.md` first. §7 (Hero Name Specification) has a new subsection —
"Typewriter animation (locked 2026-07-11, Piece 2a Revisions Part 4)" — which is the spec
for this task. §12 (Decisions) has a matching one-line addition. Treat `DESIGN_UPDATED.md`
as authoritative; if anything here conflicts with it, `DESIGN_UPDATED.md` wins.

This is a **small, tightly scoped addition** to the hero name only. Do not touch the
terminal (Piece 3, not built yet), the statue, paper balls, resume scroll, footer, cursor,
scrollbar, or the scroll-stack mechanics (Piece 2b). Do not change the hero name's existing
font, color, position, or z-index — those are already correct and locked; this task only
adds a type-in/delete animation layer on top of what's already there.

## Scope for this task

Animate the existing two-line hero name ("Zeeshaan" / "Suhail Shaik") with a continuous
terminal-style typewriter loop:

1. **Sequence (in order, looping continuously, no interaction required to trigger it):**
   1. "Zeeshaan" types in character by character on line 1
   2. Brief pause (~300ms)
   3. "Suhail Shaik" types in character by character on line 2
   4. Full hold with both lines complete (~1.8s)
   5. "Suhail Shaik" deletes character by character (line 2 first — reverse of typing order)
   6. Brief pause (~300ms)
   7. "Zeeshaan" deletes character by character
   8. Brief pause at fully empty (~600ms), then loop back to step 1

2. **Speed:** ~80ms per character while typing, ~50ms per character while deleting.

3. **Blinking cursor:** a thin vertical bar/block cursor, dimmed acid-green
   (`brightness(0.65)`, matching the existing hero text glow), positioned at the end of
   whichever line is currently active. Keeps blinking through the pause states too,
   including the fully-empty pause at step 8.

4. **Layout stability — important:** reserve the full two-line container height/position
   from the start, so line 2's space is already occupied (just empty) even while line 1 is
   still typing, and nothing shifts vertically at any point in the loop. This matters
   because the hero name sits directly behind the statue's raised elbow (`z-index: 1`) —
   any layout jump here would visibly disturb that alignment. Verify against the existing
   positioning (`left: 3.5rem` desktop / `left: 2rem` mobile, `top: 1.5em`, line 2 indented
   `2ch`) before and after — none of that should move.

5. **Implementation:** a custom typewriter effect (`setInterval`/`setTimeout` chain or
   `requestAnimationFrame`, driven by React state) — do not introduce a GSAP TextPlugin
   dependency (it requires a Club GreenSock license). Keep the implementation simple enough
   that it can later be wrapped in a `prefers-reduced-motion` check (Piece 6) without a
   rewrite — you don't need to add that check now, just don't paint yourself into a corner
   that makes it hard later.

## Explicitly out of scope for this task
- Terminal (Piece 3)
- Statue, paper balls, resume scroll, footer, cursor, scrollbar
- Scroll-stack mechanics (Piece 2b)
- `prefers-reduced-motion` gating (Piece 6) — just keep the implementation simple, don't
  add the actual check yet
- Any change to the hero name's font, color, position, or z-index

## Acceptance criteria
- `npm run dev` runs cleanly with no console errors
- Hero name types in sequentially (line 1, then line 2), holds, deletes in reverse order
  (line 2, then line 1), pauses briefly at empty, and loops continuously without needing any
  user interaction
- Blinking cursor is visible at the end of the active line throughout, including during
  pauses
- No layout shift anywhere in the loop — statue positioning relative to the hero name stays
  exactly as it was before this change
- No regressions to hero name's existing font, color/glow, position, or z-index
- No regressions to any other completed piece
- Committed with a clear, scoped commit message (e.g. `feat: hero name typewriter loop`)

## After completing
Confirm the loop runs continuously with no layout shift, note the actual timing values used
if you had to deviate from the ones above, and stop for review before moving on to Piece 3
(terminal).
