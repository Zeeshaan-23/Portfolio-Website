# Piece 1 — Revision Pass

Reference `DESIGN.md` and `ANTIGRAVITY_PROMPT.md` in this folder for full context. This is a
revision pass on the gallery hero scene already built — not a new piece. Make the following
targeted fixes only; don't touch navigation, fonts, or anything else that's already working.

## 1. Statue asset swap
- I'm dropping a new `statue.png` (background removed, transparent PNG) into the same path
  the component already reads from (`/public/assets/statue/statue.png` per `DESIGN.md` §9).
  No code change needed here unless the new image's aspect ratio differs significantly from
  the placeholder — if so, adjust the container sizing to avoid stretching/squashing.

## 2. Statue sizing
- Increase the statue's rendered size by roughly 15–20%. It should feel like the clear
  focal point of the room, not a smaller element floating in a large empty space. Keep it
  centered on the pedestal area as-is.

## 3. Statue dimming (match gallery ambience)
- The current statue render is too bright/clean for a dim museum at night — it's reading as
  a well-lit product photo, not something under a single dim spotlight. Reduce brightness
  and contrast slightly so it feels lit *by* the spotlight rather than independently bright.
  Approximate CSS as a starting point (tune by eye against the background):
  ```css
  filter: brightness(0.82) contrast(0.95) saturate(0.9);
  ```
- Keep the spotlight glow (acid green tint) as-is on top of this — the statue should still
  read as the brightest object in the room, just not overexposed relative to the rest of the
  scene.

## 4. Paper ball scatter (fix the line-up)
- The 5 paper balls currently sit in a visually obvious straight horizontal line — this reads
  as a UI row, not "scattered on the floor." Reposition them with irregular placement:
  - Vary both x AND y position for each ball (not just spread along one horizontal axis)
  - Vary distance from the statue/pedestal — some closer, some further, not equidistant
  - Vary size slightly per ball (e.g. 85%–110% of a base size) to imply depth/perspective —
    balls "closer to camera" (lower on screen) slightly larger, ones further back smaller
  - Keep all 5 clear of the statue/pedestal and clear of each other (no overlap), and keep
    them within the floor area, not touching the back wall
  - It's fine to eyeball natural-looking positions rather than using an exact grid or formula

## 5. Paper ball dimming
- Same issue as the statue — the paper balls currently look too light/clean against the dark
  floor. Once I drop in the background-removed versions (edges will be clean), also dim them
  to sit naturally in the scene:
  ```css
  filter: brightness(0.65) saturate(0.85);
  ```
  Add a soft drop shadow if not already present so they feel grounded on the floor rather
  than pasted on top:
  ```css
  filter: brightness(0.65) saturate(0.85) drop-shadow(0 4px 6px rgba(0,0,0,0.5));
  ```

## 6. Build log — going forward, do this automatically
Starting now, maintain `BUILD_LOG.md` in this folder (create it if it doesn't exist yet,
using the template already in the repo if one exists) without being asked each time:
- After every commit, append a short entry: what changed, why (if a judgment call was made),
  and update the piece status table (copied from `DESIGN.md` §6) if a piece's status changes
- Keep entries terse — a few lines per commit, not a full changelog essay
- This log is how I keep context across separate sessions with you and with Claude, so treat
  it as a required part of finishing any task, not optional documentation

## Acceptance criteria for this revision pass
- Statue is visibly larger and dimmer, matches the gallery's ambient darkness
- Paper balls are scattered irregularly (no visible line/pattern), sized with slight variation,
  and dimmed/grounded with shadow
- `BUILD_LOG.md` exists and has an entry for this revision pass
- Commit with a Conventional Commits message, e.g.
  `fix(gallery): rescale and dim statue, scatter and dim paper balls`
