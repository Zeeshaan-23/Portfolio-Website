# Task for Antigravity — Piece 2a Revisions, Part 3: Cursor + Scrollbar

## Context
Read `DESIGN_UPDATED.md` in this folder first — it is the current source-of-truth design
spec. §2 (Visual Language → Cursor, Scrollbar) and §12 (Decisions) have just been updated
with the exact specs for this task. Treat `DESIGN_UPDATED.md` as authoritative; if anything
here conflicts with it, `DESIGN_UPDATED.md` wins.

This is **Piece 2a, Revisions Part 3** — a small, tightly scoped follow-up to the hero name /
texture / footer work already shipped in Piece 2a. **Only touch the cursor and the
scrollbar.** Do not modify the hero name, statue, paper balls, resume scroll, footer, fonts,
or any section content. Do not start on Piece 3 (terminal) work.

---

## 1. Custom Cursor

Replace the current default system cursor with a custom thin crosshair, globally across the
site (gallery hero + all section pages).

**Default state:**
- Thin (1px stroke) crosshair — two short perpendicular lines with a small open gap at the
  center (not a solid plus-sign / not a filled shape). Roughly 20–24px square overall.
- Color: acid green `#39ff14`, with a subtle ~1px dark stroke/halo (`rgba(17,17,17,0.6)`)
  around the green lines so it stays legible over the lighter cream paper section
  backgrounds, not just the dark gallery scene.
- Hotspot (the actual click point) must be at the dead center of the crosshair, not the
  top-left corner of the image.

**Hover / interactive state:**
- On all clickable elements (paper balls, resume scroll, terminal window once it exists,
  nav links, footer links, buttons) the crosshair should swap to a variant with a small
  filled center dot — a "targeting" cue signaling interactivity, instead of switching to a
  generic system pointer.
- Same color treatment (acid green + dark halo) as the default state.

**Implementation approach:**
- Two SVG assets (or inline SVG data URIs): `cursor-default.svg` and `cursor-active.svg`.
- Apply via CSS `cursor: url(...) 12 12, crosshair;` globally on `html`/`body`, and override
  to the active variant via `:hover` on interactive elements (or a shared `.cursor-target`
  utility class if that's cleaner given the current component structure).
- Keep the `crosshair` keyword as the fallback value (after the url) in case the custom
  image fails to load — it's already visually close to the intended shape.
- Test that it renders correctly over both the dark gallery hero and the yellowed paper
  section backgrounds.

---

## 2. Scrollbar Styling

Replace the default unstyled (white) OS scrollbar with a themed version.

- **Track:** near-black `#1c1a17`
- **Thumb:** acid green `#39ff14`, at ~0.4 opacity at rest, full opacity on hover
- Keep the thumb dimmer than the terminal cursor / hero glow at rest — it shouldn't compete
  as the brightest green element on screen, just be present and on-theme instead of jarring
  white.
- **Implementation:**
  - Webkit/Chromium/Safari: `::-webkit-scrollbar`, `::-webkit-scrollbar-track`,
    `::-webkit-scrollbar-thumb`, `::-webkit-scrollbar-thumb:hover`
  - Firefox: `scrollbar-color: #39ff14 #1c1a17;` + `scrollbar-width: thin;` on `html`
  - Apply globally (gallery hero scroll + all section page scroll), no border-radius (keep
    it flat/square per the "no digital-clean drop shadows" texture rule in DESIGN_UPDATED.md §2)

---

## Explicitly out of scope for this task
- Hero name, statue, paper balls, resume scroll, footer — do not touch
- Terminal component (Piece 3)
- Any section content (Piece 3a)
- Paper ball unfold animation (Piece 3b)

## Acceptance criteria
- `npm run dev` runs cleanly with no console errors
- Custom crosshair cursor renders (not the system default) across the gallery hero and all
  section pages, with correctly centered hotspot
- Cursor swaps to the filled-center "active" variant when hovering any clickable element
- Scrollbar shows the near-black track / dimmed acid-green thumb in Chromium-based browsers
  and Firefox, brightening on hover
- No regressions to hero name, statue, paper balls, resume scroll, or footer from the
  previous Piece 2a work
- Committed with clear, scoped commit messages (e.g. `feat: custom crosshair cursor`,
  `style: themed scrollbar`) — not bundled into one giant commit

## After completing
Summarize what you built, flag anything ambiguous (e.g. cursor legibility issues on specific
backgrounds), and stop for review before starting Piece 3 (terminal navigation).
