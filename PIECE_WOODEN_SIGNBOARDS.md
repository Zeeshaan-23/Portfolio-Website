# Task for Antigravity — Wooden Signboards (Resume + Terminal)

## Context
Read `DESIGN_UPDATED.md` first. §16 (Wooden Signboards) is the spec for this task. Treat
`DESIGN_UPDATED.md` as authoritative; if anything here conflicts with it, `DESIGN_UPDATED.md`
wins.

This is a small, self-contained addition: two labeled wooden signboard images, placed above
the resume scroll and the terminal's back-wall painting trigger, so it's clearer at a glance
that both are clickable. **Layout/positioning work only — the art itself is already done.**
Do not touch the resume scroll's or terminal frame's own click targets, hover states, or any
other completed piece.

## Assets (already provided, in place)
- `/public/assets/Resume-board.png`
- `/public/assets/Terminal-board.png`

## Scope for this task

1. **Resume board:** position `Resume-board.png` directly above the resume scroll (see the
   resume scroll's existing positioning — right wall, `right: 4%` desktop, per §3/§7).
   Small scale, supporting label — should not compete with the resume scroll itself or the
   statue for visual weight.

2. **Terminal board:** position `Terminal-board.png` directly above the terminal's back-wall
   painting trigger (see §15's Open/close trigger section for where that hotspot sits).
   Same scale/treatment approach as the resume board.

3. **Always visible** on page load — not a hover-triggered tooltip, no fade-in.

4. **Visual integration:** dim/shade the boards to match the ambient museum lighting the
   same way the resume scroll is treated at rest (`brightness(0.45) saturate(0.80)` is the
   resume scroll's existing rest-state filter — use as a starting point, but adjust based on
   how the actual PNGs look once placed; if they already read correctly against the dark
   gallery background without extra filtering, don't force it).

5. **No new interactivity:** the boards themselves are not clickable and don't need hover
   states, glow, or any animation. The resume scroll and terminal frame keep their existing
   click targets, hover cursor states, and glow effects exactly as they are — the boards sit
   above them as a static label layer only.

## Explicitly out of scope for this task
- Any change to the resume scroll's or terminal frame's click behavior, hover states, or
  positioning
- Terminal component logic (Piece 3, separate task)
- Any animation on the boards themselves
- Any other piece (hero name, statue, paper balls, footer, cursor, scrollbar, scroll-stack)

## Acceptance criteria
- `npm run dev` runs cleanly with no console errors
- Both boards render, correctly positioned above their respective elements, visible on load
- Boards read as part of the museum wall dressing (lighting-consistent with surroundings),
  not pasted-on-top
- Resume scroll and terminal frame trigger still work exactly as before — no regressions to
  their click targets or hover states
- No regressions to any other completed piece
- Committed with a clear, scoped commit message (e.g. `feat: add wooden signboards for resume and terminal`)

## After completing
Confirm both boards are positioned and visible correctly, note the final filter/brightness
values used if you had to adjust from the starting point above, and stop for review.
