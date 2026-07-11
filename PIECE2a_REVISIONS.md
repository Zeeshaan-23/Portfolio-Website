# Piece 2a — Gallery Enhancements: Hero Name, Section Texture, & Footer

## Context
This revision follows successful completion of Piece 1 and Piece 2 (gallery skeleton + scroll navigation).
Reference the updated `DESIGN_UPDATED.md` §7 (Hero Name), §9 (Footer), and §8 (section texture) for full
specifications. This task focuses on three visual polish additions — do not rebuild navigation,
animations, or content. Keep existing structure and functionality intact.

## Assets provided in this folder
- Crumpled paper texture image (for section background overlay, if provided)
- Updated `DESIGN_UPDATED.md` with sections 7, 9 detailing hero name and footer specs

If any asset is missing, use a clearly-labeled placeholder or skip that element and flag it.

## Scope

### 1. Hero Name — Top-Left Gallery Display

Add your name to the gallery hero scene in the top-left area.

**Text:** "Zeeshaan Suhail Shaik"

**Positioning & Sizing:**
- Position: `position: absolute; top: 2rem; left: 2rem` (adjust margins to match layout)
- Z-index: above statue, below terminal
- Size: large and commanding (~3rem–3.5rem responsive), occupying roughly the first quadrant
- Do not pull focus from the statue; balance should favor the statue as primary focal point

**Typography & Styling:**
- Font: JetBrains Mono or IBM Plex Mono (monospace, matching existing UI font)
- Color: Acid green `#39ff14`
- Letter-spacing: increase slightly (`0.05em`–`0.1em`) for spread-out, intentional look
- Text-shadow glow: `text-shadow: 0 0 8px #39ff14, 0 0 16px rgba(57, 255, 20, 0.5)` — tune opacity/blur by eye for a subtle glow effect
- Line-height: tight (1.0–1.1) to keep the name compact

**No animations yet** — static text for now. Scan-line flicker effects deferred to later pieces.

---

### 2. Section Background Texture Overlay

Add a subtle crumpled paper texture to all 5 fullscreen section backgrounds to deepen the
"aged museum document" feel.

**Texture asset:**
- Crumpled paper texture image (grey shaded or any base color — will be color-adjusted via CSS)
- High-resolution, tileable or at least 2000px+ wide
- File placement: `/public/assets/textures/paper-crumple.png` (adjust path if different)

**Application:**
- Add as a `::before` pseudo-element or separate overlay div on each section container
- CSS properties (adjust to match yellowed cream page color):
  ```css
  background-image: url('/public/assets/textures/paper-crumple.png');
  background-size: cover; /* or auto if tileable */
  mix-blend-mode: multiply;
  opacity: 0.15; /* tune by eye — should be subtle, not visually dominant */
  filter: hue-rotate(40deg) saturate(0.6) brightness(1.2); /* shifts grey toward warm cream tones */
  pointer-events: none; /* ensure it doesn't interfere with clicking/scrolling */
  ```
- Stacking: overlay should sit on top of the yellowed cream background but below text content
- Apply to all 5 sections (About, Skills & Certs, Projects, Experience, Domains of Study)
- **Fine-tuning:** adjust `hue-rotate`, `saturation`, `brightness`, and `opacity` by eye until it matches the aged paper aesthetic without looking too dark or oversaturated

**Text legibility check:**
- Ensure body text (monospace) and section headers (serif) remain clearly readable over the texture
- If text becomes muddy, either reduce texture opacity further or slightly increase text color
  contrast (e.g. use `#0a0805` instead of `#1c1a17` for body text if needed)

---

### 3. Footer — Contact, Links & Metadata

Add a clean, professional footer at the bottom of the page (below all 5 sections, visible when
user scrolls to the very bottom).

**Content & Structure:**
- Divide footer into 2–3 logical columns/sections:
  1. **Contact Info** — email, phone (if public), any other direct contact
  2. **Links** — GitHub, LinkedIn, portfolio/blog links (if applicable)
  3. **Metadata** — "Last compiled: [date]", site version, catchline like "Artifacts compiled by Zeeshaan" in comment or shell-prompt style

**Typography & Styling:**
- Font: JetBrains Mono or IBM Plex Mono (monospace only, matching UI font)
- Default text color: neutral grey (`#8a8a86` or similar)
- Link color default: same grey; on hover: acid green `#39ff14` with underline
- Link hover effect: `text-shadow: 0 0 4px #39ff14` (subtle glow on hover)
- No colored icons — use text labels like `[github]`, `[linkedin]` or minimal SVG outlines only

**Layout:**
- Full-width footer, edge-to-edge
- Top border: acid green horizontal line (`border-top: 1px solid #39ff14`)
- Padding: ample spacing, roughly `2rem 1.5rem` or similar (tune for comfort)
- Column layout: left-aligned, 2–3 columns depending on content volume
- Responsive: stack to single column on narrower viewports (defer mobile specifics to Piece 6)

**Aesthetic touches (stay true to museum/cyber theme):**
- Metadata lines styled as code comments: `// Last compiled: 2026-07-10`
- Or shell-prompt style: `> whoami // zeeshaan@portfolio`
- No generic web footer look (centered, corporate, branded)
- Keep colors and fonts disciplined: monospace + acid green only

**Placement:**
- Positioned below all 5 fullscreen sections
- Scrolls into view naturally as user reaches bottom of page
- Ensure it doesn't accidentally get cut off or hidden behind fixed elements

---

### 4. Resume Scroll — Gallery Right Wall Element (Prominent)

Add a clickable resume scroll to the right side wall of the gallery scene, prominently positioned
so it's immediately visible at a glance. The scroll should match the visual scale and presence
of the paper balls — a significant gallery element, not a small icon.

**Visual design:**
- Resume scroll PNG (already in proper color per your generation)
- Position: right side wall area (vertically centered or positioned naturally on the wall)
- Size: **similar scale to paper balls** — prominent and easily noticeable, not diminished
- Transparency: transparent background PNG, integrates cleanly into the wall
- Dimming/lighting: match ambient gallery lighting (if needed, apply light filter similar to paper balls)

**Interaction:**
- On click: open your resume in a new tab (`target="_blank"`)
- Add hover effect: subtle scale up + acid green glow/outline to indicate interactivity
  ```css
  transition: transform 200ms ease, filter 200ms ease;
  &:hover {
    transform: scale(1.08);
    filter: drop-shadow(0 0 8px #39ff14);
  }
  ```
- No state change to `currentSection` — this is a utility action, not navigation

**Asset:**
- Resume scroll PNG (transparent background, already in proper color)
- File placement: `/public/assets/resume-scroll.png`

**Resume file:**
- Place your actual resume PDF at `/public/resume.pdf`
- Update the click handler to link to this file (opens in new tab)

---

## Footer Content — Provided by Zeeshaan

**Contact Info:**
- Email: zeeshaansuhail23@gmail.com
- Phone: [not provided, omit from footer]

**Links:**
- GitHub: https://github.com/Zeeshaan-23
- LinkedIn: https://www.linkedin.com/in/zeeshaan-suhail

**Metadata line (suggested options, pick one or suggest your own):**
- `// Artifacts compiled by Zeeshaan`
- `// Last compiled: 2026-07-10`
- `> whoami // zeeshaan@portfolio`
- Or combine: `// Compiled 2026 | > find . -name "portfolio" -type digital`

---

## Build log
After completing this revision:
- Update `BUILD_LOG.md` with an entry describing hero name addition, section texture overlay,
  resume scroll implementation, and footer.
- Note any asset gaps or styling decisions you made by eye.

## Acceptance criteria
- `npm run dev` runs with no console errors.
- Hero name "Zeeshaan Suhail Shaik" is visible in top-left of gallery hero, acid green with glow,
  monospace font, balanced against statue (not stealing focus).
- All 5 sections display crumpled paper texture overlay, subtle but visible, text remains legible.
- Resume scroll is visible on the back wall, styled to match gallery ambience, clickable to
  open/download resume PDF. Hover effect (scale/glow) is responsive.
- Footer is visible at bottom of page, contains contact info (email, GitHub, LinkedIn), metadata,
  and is styled in monospace with acid green hover effects, full-width with green top border.
- Code committed with a Conventional Commits message, e.g.
  `feat(design): add hero name, section texture, resume scroll, and footer`

## After completing
Commit and summarize. Flag any texture opacity tuning or layout decisions made by eye, and
await review before proceeding to Piece 3 (terminal component).
