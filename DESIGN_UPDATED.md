# Portfolio Site — Design Spec
**Codename:** Digital Antiquity — "The Archive / Terminal Oracle"

---

## 1. Concept

A dim museum gallery at night. A single Greek statue stands center-stage under a spotlight,
half classical marble / half glitching into ASCII. Cracks run from its pedestal into the
floor, with binary characters flowing upward through them like a hacker-movie terminal feed.
Scattered on the floor are crumpled paper balls — each one a section of the site. A floating
Mac-style terminal window sits in front of the whole scene, doubling as both an aesthetic
object and the primary navigation method.

The whole site is one scene (the gallery) with sections reached by clicking a paper ball,
typing a command into the terminal, or scrolling — all three write to the same navigation
state. When a section opens, the clicked paper ball visually unfolds (stop-motion style) into
the section background, bridging gallery and content.

---

## 2. Visual Language

### Palette
| Role | Color | Notes |
|---|---|---|
| Base / walls | Concrete grey `#8a8a86` → `#6e6e6a` | Matches museum reference images |
| Marble / statue | Off-white cream `#e8e2d4` | |
| Paper (old library) | Yellowed cream `#e6dcc0` | Page backgrounds |
| Ink / body text | Near-black `#1c1a17` | |
| Accent (terminal / glow) | Acid green `#39ff14` | Hero name glow, cursor, binary stream, spotlight glow, hover states |
| Shadow / depth | `#111111` at low opacity | Gallery dimness |

Rule of thumb: 90% neutral (concrete/marble/paper), 10% accent. The accent color is the
"electricity" — it should only appear where something digital is happening (terminal,
cracks, ASCII glitch, hero name, hover states).

### Typography
- **Section headers:** distressed classical serif — *Special Elite* or *IM Fell English* (Google Fonts)
- **Body / UI / terminal / hero name:** monospace — *JetBrains Mono* or *IBM Plex Mono*
- Two fonts only. No third typeface.

### Texture
- Subtle film-grain / noise overlay across the whole viewport (SVG `feTurbulence`, low opacity)
- Paper background = yellowed texture image, `mix-blend-mode: multiply` over cream base
- Torn/ragged edges on paper page panels (clip-path or PNG mask)
- No drop shadows that look "digital-clean" — everything should feel slightly aged/rough

### Cursor
- Default system cursor (explicitly NOT a custom cursor — keep it normal per spec)

---

## 3. Scene Breakdown (from concept sketch)

```
┌─────────────────────────────────────────────┐
│ [NAME]          [ STATUE ]        [frames]  │  ← hero name (top-left), statue (center), back wall frames
│                 spotlight ↓                  │
│                                               │
│              statue on pedestal              │
│         (left half = ASCII, right = marble)  │
│                                               │
│   ≈≈≈ cracks radiating from pedestal ≈≈≈     │
│   ↑ binary chars flowing up through cracks   │
│                                               │
│  [paper]   [ TERMINAL WINDOW ]     [paper]   │
│  [paper]                            [paper]  │
└─────────────────────────────────────────────┘
```

**Layers (back to front):**
1. Gallery background (wall + floor, dim lighting, museum photo frames w/ tech stack)
2. Spotlight cone (CSS radial-gradient) on the statue
3. Statue (marble render with ground-lit green glow, right half normal / left half ASCII via clip-path split)
4. Cracks (SVG path from pedestal base fanning across floor)
5. Binary stream (chars animated along crack paths, upward, accent color)
6. Paper balls (5 total — one per nav section), scattered floor positions
7. Resume scroll (right side wall, prominently positioned, similar scale to paper balls)
8. Hero name (top-left, "Zeeshaan Suhail Shaik" in acid green monospace with text-shadow glow)
9. Terminal window (floating, draggable or fixed, front-most)

**Nav sections (5 paper balls + terminal commands + scrolling):**
1. About — simple bio section
2. Skills & Certs — carousel layout with cards (skill/cert title, icon, date)
3. Projects — carousel layout with cards (project title, tech stack, image, link)
4. Experience — horizontal timeline with animated sprites (role, company, date, description)
5. Domains of Study / Interest — simple list section

**Utility elements (non-section navigation):**
- Resume scroll (wall-mounted, opens/downloads resume PDF on click)

---

## 4. Navigation Model

Single source of truth: `currentSection` state (Zustand store).

Three input methods, all write to the same state:
- **Click** a paper ball → unfold animation (stop-motion style) → transition to section
- **Terminal command** (`cd projects`, `ls`, `cat about`, `whoami`, `help`) → same transition
- **Scroll** → scrolling past the gallery hero scrolls into section content, updates `currentSection`

When a section opens via paper ball click: the clicked ball visually expands/unfolds (frame-by-frame
animation or morphing) into the section's background, creating a visual bridge rather than a flat
fade. Body content fades in after unfold completes.

---

## 5. Tech Stack

- **Framework:** Next.js (App Router) — enables real per-section URLs (`/projects`, `/about`)
- **State:** Zustand (single `currentSection` store)
- **Scroll:** Lenis (smooth scroll) + GSAP ScrollTrigger + Intersection Observer (for section detection)
- **Animation:** GSAP (core) + MotionPath plugin (binary-along-crack animation)
- **Carousels:** Framer Motion or Swiper.js (auto-scroll on idle, manual navigation with buttons)
- **Timeline:** Custom HTML layout with CSS positioning; animated sprites rendered via `<img>` (GIF) or `<canvas>` spritesheet
- **Statue (current, 2D):** plain `<canvas>` + custom luminance-to-ASCII utility — see §9
- **Spotlight:** CSS radial-gradient (2D)
- **Paper ball physics (optional polish):** Matter.js — subtle roll-on-hover only, last priority
- **Draggable terminal (optional):** react-rnd or interact.js
- **Parallax on photo frames:** vanilla-tilt.js
- **Fonts:** Google Fonts — Special Elite / IM Fell English + JetBrains Mono / IBM Plex Mono

---

## 6. Build Order (piece by piece)

| # | Piece | Goal | Status |
|---|---|---|---|
| 1 | Static gallery layout (statue, spotlight, paper balls) | Core UX skeleton | ✅ |
| 2 | Scroll-based section navigation + fullscreen layout | Smooth scrolling & layout stubs | ✅ |
| 2a | Gallery enhancements (hero name, texture, footer) | Visual polish on hero & sections | ⬜ |
| 3 | Terminal component wired to same nav state | Third nav method works | ⬜ |
| 3a | Section content & components (carousels, timeline) | Fill sections with interactive patterns | ⬜ |
| 3b | Paper ball unfold transition animation | Visual bridge from gallery to section | ⬜ |
| 4 | Crack SVG + binary MotionPath animation | Hero animation layer 1 | ⬜ |
| 5 | ASCII-split statue effect (canvas luminance → characters) | Hero animation layer 2 | ⬜ |
| 6 | Mobile fallback + `prefers-reduced-motion` | Perf/accessibility pass | ⬜ |

Mark status as pieces complete; keep this table updated in `BUILD_LOG.md`.

---

## 7. Hero Name Specification

**Text:** "Zeeshaan Suhail Shaik"  
**Position:** Top-left area of the gallery hero, occupying roughly the first quadrant (3×3 grid)  
**Typography:** JetBrains Mono or IBM Plex Mono (monospace, matching UI font)  
**Color:** Acid green `#39ff14`  
**Size:** Large (~3rem–3.5rem, responsive), commanding but not pulling focus from the statue  
**Styling:**
- Letter-spacing: increase slightly (`0.05em`–`0.1em`) for a spread-out, intentional feel
- Text-shadow glow: `text-shadow: 0 0 8px #39ff14, 0 0 16px rgba(57, 255, 20, 0.5)` (tune opacity/blur)
- Positioning: `position: absolute; top: 2rem; left: 2rem` (adjust margins to match design)
- Z-index: ensure it sits above statue but below terminal
- Optional (future): subtle scan-line flicker on hover for CRT effect (deferred to Piece 3b or later)

---

## 8. Section Components

### 8a. Carousel (Skills & Certs, Projects)
**Applies to:** Skills & Certs section, Projects section

**Card structure (minimal for now, finalize later):**
- Title / Name
- Icon or small image
- Description / metadata
- Link (if applicable)

**Carousel behavior:**
- Auto-scroll on idle (cycle through cards continuously at ~4–5sec per card)
- Manual navigation: prev/next buttons on the sides (left and right edges of viewport)
- Keyboard support: left/right arrows advance cards
- Smooth transition between cards (GSAP or Framer Motion tween)
- Dot indicators showing current card position (optional visual aid)

**Layout:** Horizontal scroll, one card centered in viewport at a time, with partial prev/next
cards visible on the sides (peek effect).

**Implementation library:** Swiper.js or Framer Motion + custom carousel wrapper.

### 8b. Timeline (Experience)
**Applies to:** Experience section

**Timeline structure:**
- Horizontal line (left to right, bottom-to-top chronological or vice versa — to finalize)
- Milestones positioned along the line (e.g. 5–7 past/current roles)
- Each milestone contains:
  - Date range (e.g. "2023–2025")
  - Role title + Company name
  - Brief description
  - Animated sprite (small looping 2D animation)

**Sprite behavior:**
- Sprites are provided as animated GIFs or spritesheet PNGs
- Auto-loop continuously, or play on hover (to finalize with sprite delivery)
- Size: ~80–120px (small, supporting detail not focal point)
- Positioned beside or above/below the milestone text

**Layout:** Full-width horizontal line with milestones staggered/offset for visual interest.

---

## 9. Footer Specification

**Content sections:**
1. Contact info (email, phone if public)
2. Links (GitHub, LinkedIn, portfolio/blog if applicable)
3. Metadata (last updated, site version, "artifacts compiled by Zeeshaan")

**Styling:**
- Top divider: full-width acid green line (`border-top: 1px solid #39ff14`)
- Typography: all monospace (JetBrains Mono / IBM Plex Mono), matching UI font
- Color: neutral grey (`#8a8a86` or similar) for default text, acid green on hover
- Link hover: `text-shadow: 0 0 4px #39ff14`, underline

**Layout:**
- 2–3 columns, left-aligned
- Ample padding (`2rem 1.5rem` or similar)
- Optional metadata lines in "comment" style (`// Last compiled: 2026-07-10`) or shell prompt style (`> whoami // zeeshaan@portfolio`)

**Link rendering:**
- Text labels, not colorful icons (`[github]`, `[linkedin]`, etc.)
- Or minimal SVG outlines if icons are desired
- Avoid generic web footer feel

**Not included:**
- Centered, corporate-symmetric layouts
- Colorful social media icon sets
- Large brand logos
- Anything that breaks the monospace/serif + acid-green discipline

---

## 10. Paper Ball Unfold Animation (Piece 3b)

**Trigger:** Clicking a paper ball in the gallery  
**Animation style:** Stop-motion / frame-by-frame unfolding, not a smooth morph  
**Sequence:**
1. Clicked paper ball scales up and remains in place
2. Ball unfolds/expands (visual frames showing the paper expanding/flattening)
3. Simultaneously, section background fades in around the unfolded paper
4. Body content fades in after unfold completes
5. Camera/scroll smoothly moves to the section position

**Technical approach:**
- GSAP timeline controlling scale, position, opacity
- Optionally use sprite/strip of "unfold" frames if stop-motion effect is important
- Duration: ~600–800ms for smooth but snappy feel
- Keep unfolding centered on clicked ball position, then transition to section

**Deferred:** This piece is built *after* section content exists, so the animation lands on
real content, not placeholder.

---

## 11. Assets Needed (in progress — being generated separately)

- [x] Gallery background (wall + floor, dim museum lighting)
- [ ] Photo frame contents (tech stack icons/logos) for back wall
- [x] Statue with ground-lit green glow (transparent background)
- [x] 5x crumpled paper ball sprites (scattered positioning complete)
- [ ] Resume scroll sprite (wall-mounted decoration, transparent background)
- [ ] Crumpled paper texture overlay (for section backgrounds)
- [ ] Torn-edge mask/PNG (for section edges) — optional, may use clip-path instead
- [ ] Animated sprites for timeline (Experience section) — pending research & generation
- [x] Resume PDF file (`/public/resume.pdf`)

---

## 12. Decisions (locked)
- **Accent color:** acid green `#39ff14`
- **Statue:** 2D for now (see §9 for approach)
- **Framework:** Next.js (App Router)
- **Hero name font:** Monospace (JetBrains Mono / IBM Plex Mono), acid green, top-left
- **Carousels:** Swiper.js or Framer Motion, auto-scroll on idle + manual buttons
- **Timeline:** Horizontal, with animated sprite support (sprites TBD)
- **Footer:** Monospace, minimal, museum/cyber aesthetic

---

## 13. 2D Statue — ASCII Split Approach

Since we're not using Three.js/AsciiEffect yet, the ASCII half is generated client-side from
the SAME source image, not a separately generated "ASCII picture." This keeps the two halves
structurally aligned (same pose, same proportions) since they come from one file.

**Pipeline:**
1. Single statue PNG (marble render with ground-lit green glow, transparent background) is the only asset needed.
2. On load, draw the image to a hidden `<canvas>`.
3. Sample the image in a grid (e.g. 6px × 10px blocks). For each block, compute average
   luminance and map it to a character from a ramp: `" .:-=+*#%@"` (light → dark).
4. Render the resulting characters as monospace text (acid green, `#39ff14`) onto a second
   canvas or absolutely-positioned `<pre>`, sized/positioned to exactly overlay the source image.
5. Reveal only the left half of this ASCII canvas over the normal image using `clip-path:
   inset(0 50% 0 0)` (or an animated/jagged clip-path for a less clean seam, per the sketch's
   "glitch" feel).
6. Optional: animate the clip boundary ±2–4px with GSAP on a loop for a subtle flicker.

This is a self-contained ~40–60 line utility (`asciiFromImage.ts`), no external ASCII library
required, and can be swapped later for Three.js without touching layout code.

### Statue image generation prompt
Use with Midjourney, DALL-E, or SDXL/Stable Diffusion:

> A weathered classical Greek marble bust statue, head and shoulders, facing forward,
> dramatic single overhead spotlight, deep shadows, museum lighting, photorealistic marble
> texture with visible cracks and age, illuminated from below by acid green light,
> plain solid dark grey background, studio photography style, high detail, centered composition, 4k

**Settings to request/set:**
- Aspect ratio: portrait, roughly 3:4 or 2:3
- Plain/solid background (dark grey or black) for easy keying
- Ground-lit green glow visible on statue base and lower half (not overexposed)
- Transparent background export (PNG alpha)
- Avoid props, other figures, or text in frame — just the bust, centered

**File placement:**
```
/public/assets/statue/statue.png       ← the single source image, transparent bg preferred
```
