# Task for Antigravity — Piece 2b Revisions: Stationary Dim (Remove Scale)

## Context
Read `DESIGN_UPDATED.md` first — §14 (Scroll Stack / Depth Layering) has just been corrected
and is the spec for this task. Treat it as authoritative.

Piece 2b (scroll stack) is built and mostly right, but the outgoing section currently scales
down (`1.0` → `0.94`) as it dims. That reads as the page moving/shrinking away, which is not
the intended effect. **This task is a single, targeted fix: remove the scale transform,
keep everything else.**

## What's changing

In whatever code currently animates the outgoing section's scale/brightness/opacity (per
`BUILD_LOG.md`'s Piece 2b entry — the "DOM-ref-linked Lenis event listener" tied to scroll
offset), remove the scale portion entirely:

- **Remove:** the `scale` transform (currently animating `1.0` → `0.94`) on the outgoing
  section. It should stay at `scale: 1` / its natural size for the entire scroll — no
  shrinking, no repositioning, no transform of any kind.
- **Keep:** the dimming (brightness/opacity fade, currently `brightness(0.6)` /
  `opacity: 0.7`) exactly as it is — that part is correct and should not change.
- **Keep:** the sticky pin behavior, the incoming section sliding up and covering the
  outgoing one, and the reverse-on-scroll-up behavior (dimmed sections brightening back up
  as they're revealed again).

## Explicitly out of scope for this task
- Everything else about Piece 2b (pin mechanism, dim timing/curve, sticky setup) — don't
  refactor it, just remove the scale
- Terminal (Piece 3), section content (Piece 3a), paper ball unfold (Piece 3b)
- Hero name, statue, paper balls, resume scroll, footer, cursor, scrollbar

## Acceptance criteria
- `npm run dev` runs cleanly with no console errors
- Scrolling through all 5 sections: each outgoing section stays exactly in place at full
  size — no visible shrinking or movement — and only dims as the next section covers it
- Scrolling back up: sections brighten back to full as they're revealed, still with no scale
  change at any point
- `currentSection` state, URL sync, and "Return to Gallery" still work with no regressions
- No visual or functional regressions to anything outside the scroll-stack mechanics
- Committed as a clearly-scoped commit (e.g. `fix: remove scale from scroll-stack outgoing sections`)

## After completing
Confirm the scale transform is fully removed (not just reduced), note which file(s) you
touched, and stop for review.
