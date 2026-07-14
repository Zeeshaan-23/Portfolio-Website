# Task for Antigravity — Piece 3 Revisions: Terminal Fixes + Cursor Sizing

## Context
Read `DESIGN_UPDATED.md` first (§15 Terminal, §2 Cursor) and check `BUILD_LOG.md`'s Piece 3
entry for what's already built: `store/terminalStore.ts` (open/close state), `Terminal.tsx`
(React portal, pointer-events drag), the `help`/`whoami`/`ls`/`cd <section>` command set, and
the `isProgrammatic` coordination with `navigationStore`. This task is a set of five targeted
fixes on top of that existing implementation — not a rebuild. Reference the actual current
component structure for exact file/selector names; the descriptions below describe desired
behavior, not literal code.

Do not touch section content, paper ball unfold, crack/binary animation, ASCII statue split,
hero name, statue, paper balls, resume scroll, footer, scrollbar, or wooden signboards —
none of that is in scope here.

---

## 1. Painting Hotspot — Fix Hover Outline

**Problem:** the hover highlight on the back-wall painting (the terminal's open trigger)
extends too far below the painting — it's not tracking the actual frame bounds, so the
"active" cursor/glow region reads as misaligned with the visual frame.

**Fix:**
- Re-measure/re-position the hotspot's hit area (and its hover glow) so it matches the
  painting frame's actual rendered bounds in `gallery-background.png` — not a generic
  bounding box that overshoots below it.
- Verify at a couple of viewport widths, since the background image scales — the hotspot
  needs to track the frame proportionally, not just be a fixed-pixel region tuned for one
  viewport size.
- This fix matters for §2 below too: the terminal's initial spawn position/size is being
  changed to match this same frame, so getting the bounds right here is a prerequisite.

---

## 2. Terminal Spawn Position & Sizing

**Problem:** the terminal currently opens centered in the middle of the gallery scene,
disconnected from the painting that triggered it.

**Fix:**
- On open, the terminal should appear **at the photo frame's position**, sized to
  **match the frame's bounds** (using the corrected bounds from §1) — visually, it should
  read as "the painting became the terminal," not "a terminal appeared somewhere on
  screen."
- After it opens, the user must still be able to **drag it and resize it larger or
  smaller** — the frame-matched size/position is just the spawn state, not a locked
  size. Keep the existing react-rnd (or current drag implementation) resize handles enabled;
  don't disable resizing to achieve the initial-size match.
- Confirm this still respects the existing z-index/portal setup — the terminal continues to
  render above the scroll-stack at all scroll positions regardless of its new spawn
  position.

---

## 3. Window Controls — Close Only

**Problem:** the traffic-light buttons include a "make fullscreen" button and a "minimize"
button, and neither currently works.

**Fix:**
- Remove the fullscreen button and the minimize button from the terminal's title bar
  entirely — don't leave them present-but-disabled, remove them.
- Keep only the **close** button, and make sure it correctly closes the terminal (sets
  `terminalStore`'s open state back to closed) — this should behave the same as clicking the
  back-wall frame again to close it.
- If the traffic-light styling was three dots representing all three states, it's fine to
  keep three dots visually if you want to preserve the aesthetic, but only the close dot
  should be wired to a click handler — actually, simplest and clearest: just render the one
  functional close dot. Use your judgment on which reads better, but functionality is the
  requirement — no dead buttons.

---

## 4. Clear Command + Auto-Clear on Close + Scrollwheel Support

**Add the `clear` command:**
- Typing `clear` wipes the terminal's visible command history/output, same as a standard
  shell `clear` — leaving just a fresh prompt line.

**Auto-clear on close:**
- When the terminal is closed (via the close button or the back-wall frame toggle), reset
  its command history/output state so that the **next time it's opened, it starts fresh** —
  same effect as if `clear` had just been run. Don't persist scrollback across an open/close
  cycle.

**Scrollwheel support:**
- The terminal's internal output area should scroll via the mouse scrollwheel when the
  cursor is positioned inside the terminal window — currently this doesn't work. Make sure
  scrolling inside the terminal scrolls the terminal's own output, and does **not** also
  scroll/trigger the page's Lenis scroll-stack behind it (the scroll event should be
  contained to the terminal, not bubble through to the gallery scroll).

---

## 5. Cursor — Reduce Size

**Problem:** the custom crosshair cursor (default + active/filled-center-dot variants, per
§2) currently reads as too large/heavy ("obnoxious").

**Fix:**
- Reduce the cursor's overall size somewhat from its current dimensions (currently ~20–24px
  square per spec) — aim for a noticeably sleeker, thinner presence. Tune by eye; there's no
  new exact target size, just smaller than what's shipped now.
- Keep the hotspot centered at the crosshair's dead center after resizing — don't let the
  click point drift off-center when the asset shrinks.
- Keep everything else about it unchanged: acid green `#39ff14`, dark halo stroke for
  legibility on cream paper backgrounds, filled-center-dot swap on hover over interactive
  elements.
- Update `DESIGN_UPDATED.md` §2 (Cursor) with the new size value once you've landed on one,
  so the spec reflects what's actually shipped.

---

## Explicitly out of scope for this task
- Section content and components (Piece 3a)
- Paper ball unfold animation (Piece 3b)
- Crack SVG + binary MotionPath animation (Piece 4)
- ASCII-split statue effect (Piece 5)
- Mobile fallback (Piece 6)
- Terminal command set beyond adding `clear` (no other new commands)
- Hero name, statue, paper balls, resume scroll, footer, scrollbar, wooden signboards

## Acceptance criteria
- `npm run dev` runs cleanly with no console errors
- Hovering the back-wall painting shows the hover highlight tracking the actual frame
  bounds, not overshooting below it, at multiple viewport widths
- Clicking the painting opens the terminal at the frame's position, sized to match the
  frame — not centered in the gallery
- Terminal remains draggable and resizable (both larger and smaller) after opening
- Terminal's title bar shows only a working close button — no fullscreen or minimize
  buttons present
- Typing `clear` wipes the terminal's visible output
- Closing the terminal (either method) and reopening it always shows a fresh/empty terminal
  — no leftover scrollback from the previous session
- Scrolling with the mouse wheel while the cursor is inside the terminal scrolls the
  terminal's own content only, without triggering the gallery's scroll-stack behind it
- Custom cursor (default + hover variants) is visibly smaller/sleeker while keeping its
  centered hotspot, color, and halo legibility
- No regressions to any other completed piece (paper balls, scroll-stack, hero name, resume
  scroll, footer, signboards, existing terminal commands `help`/`whoami`/`ls`/`cd`)
- Committed with clear, incremental Conventional Commits messages (e.g.
  `fix(terminal): align painting hotspot to frame bounds`, `fix(terminal): spawn at frame
  position and size`, `fix(terminal): remove nonfunctional fullscreen/minimize controls`,
  `feat(terminal): add clear command and auto-clear on close`, `fix(terminal): contain
  scrollwheel to terminal output`, `style(cursor): reduce crosshair size`) — not one giant
  commit

## Build log
After completing this task, update `BUILD_LOG.md` with a changelog entry describing each of
the five fixes and which files were touched. Piece 3's status stays ✅ (this is a revision
pass on an already-shipped piece, not a new piece).

## After completing
Summarize what you changed for each of the five items, note the final cursor size value and
frame-hotspot bounds you landed on, and stop for review before starting Piece 3a (section
content).
