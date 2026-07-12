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
| Accent (terminal / glow) | Acid green `#39ff14` | Cursor, binary stream, spotlight glow, hover states, scrollbar thumb |
| Accent, dimmed (hero name glow) | `#39ff14` at `brightness(0.65)` | Used only for the hero name text + glow, so it recedes behind the statue rather than competing as the brightest thing on screen |
| Shadow / depth | `#111111` at low opacity | Gallery dimness |

Rule of thumb: 90% neutral (concrete/marble/paper), 10% accent. The accent color is the
"electricity" — it should only appear where something digital is happening (terminal,
cracks, ASCII glitch, hero name, hover states).

### Typography
- **Section headers:** distressed classical serif — *Special Elite* or *IM Fell English* (Google Fonts)
- **Body / UI / terminal:** monospace — *JetBrains Mono* or *IBM Plex Mono*
- **Hero name only (exception, locked 2026-07-11):** *Minecraft.ttf* (local font, `public/fonts/`), pixel/blocky style. Departs from the monospace-UI rule specifically for the hero name — reads as a "glitching digital signature" next to the ASCII/binary elements. Three fonts total now: Minecraft.ttf (hero name only) + one serif (section headers) + one mono (body/UI/terminal).

### Texture
- Subtle film-grain / noise overlay across the whole viewport (SVG `feTurbulence`, low opacity)
- Paper background = yellowed texture image, `mix-blend-mode: multiply` over cream base
- Torn/ragged edges on paper page panels (clip-path or PNG mask)
- No drop shadows that look "digital-clean" — everything should feel slightly aged/rough

### Cursor
**Locked (2026-07-11):** custom thin crosshair cursor, global across the whole site (gallery + section pages), replacing the previous "default system cursor" decision.
- **Shape:** thin (1px) crosshair — two short perpendicular lines with a small open gap at the center (not a solid plus-sign), roughly 20–24px square, hotspot at dead center
- **Color:** acid green `#39ff14` — reuses the existing single accent rather than introducing a second color, so it stays visible against both the dark gallery scene and the cream paper sections. A subtle 1px dark stroke/halo (`rgba(17,17,17,0.6)`) around the green lines keeps it legible on the lighter paper backgrounds where pure green-on-cream has lower contrast.
- **Hover / interactive state:** on clickable elements (paper balls, resume scroll, terminal, nav links) the crosshair gains a small filled center dot — a "targeting" cue that reads as "this is clickable" without switching to a generic system pointer that would break the aesthetic
- **Implementation:** CSS `cursor: url(crosshair.svg) 12 12, crosshair;` (SVG data URI or file), with a second `crosshair-active.svg` for the `:hover` state on interactive elements. `crosshair` keyword as the fallback if the custom image fails to load — appropriate since it's already visually close to the intended shape.

### Scrollbar
**Locked (2026-07-11):** styled to match palette — the unstyled OS scrollbar (plain white) was breaking the aesthetic.
- Track: near-black `#1c1a17` (matches ink/shadow tones)
- Thumb: acid green `#39ff14`, dimmed to ~0.4 opacity at rest, full opacity on hover — kept dimmer than the terminal cursor/hero glow so it doesn't compete as the brightest accent element on screen
- Implementation: `::-webkit-scrollbar` + friends (Chromium/Safari), `scrollbar-color` / `scrollbar-width: thin` (Firefox), in global CSS

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
7. Resume scroll (right wall, `right: 4%` desktop, dimmed at rest via `brightness(0.45) saturate(0.80)`, brightens with acid-green glow on hover — links to `/resume.pdf`)
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
- **Terminal command** (`help`, `cd <section>`, `whoami` — minimal set for Piece 3, more commands added later) → same transition. Terminal starts minimized/closed; opens via clicking the back-wall painting trigger (see §15).
- **Scroll** → scrolling past the gallery hero scrolls into section content, updates `currentSection`. As of Piece 2b, this scroll is a sequential **stack transition** (see §14), not a flat scroll — each section stacks on top of the previous one, book-style.

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
- **Draggable terminal (locked 2026-07-11, Piece 3):** react-rnd or interact.js
- **Parallax on photo frames:** vanilla-tilt.js
- **Fonts:** Google Fonts — Special Elite / IM Fell English (section headers) + JetBrains Mono / IBM Plex Mono (body/UI/terminal); local font `Minecraft.ttf` in `public/fonts/` for the hero name only (see §2 Typography)

---

## 6. Build Order (piece by piece)

| # | Piece | Goal | Status |
|---|---|---|---|
| 1 | Static gallery layout (statue, spotlight, paper balls) | Core UX skeleton | ✅ |
| 2 | Scroll-based section navigation + fullscreen layout | Smooth scrolling & layout stubs | ✅ |
| 2a | Gallery enhancements (hero name, texture, footer, cursor + scrollbar) | Visual polish on hero & sections | ✅ |
| 2b | Scroll-stack / depth layering (gallery + all 5 sections stack sequentially) | Book-like scroll transition model | ⬜ |
| 3 | Terminal component wired to same nav state | Third nav method works | ⬜ |
| 3a | Section content & components (carousels, timeline) | Fill sections with interactive patterns | ⬜ |
| 3b | Paper ball unfold transition animation | Visual bridge from gallery to section | ⬜ |
| 4 | Crack SVG + binary MotionPath animation | Hero animation layer 1 | ⬜ |
| 5 | ASCII-split statue effect (canvas luminance → characters) | Hero animation layer 2 | ⬜ |
| 6 | Mobile fallback + `prefers-reduced-motion` | Perf/accessibility pass | ⬜ |

Mark status as pieces complete; keep this table updated in `BUILD_LOG.md`.

> Note: `BUILD_LOG.md` is the authoritative, up-to-date status tracker. This table is a snapshot synced as of 2026-07-11 — check `BUILD_LOG.md` for anything more recent.

---

## 7. Hero Name Specification

**As-built (2026-07-11, per Piece 2a Revisions Part 2 — supersedes the original single-line plan below):**
- **Text:** stacked two lines — "Zeeshaan" / "Suhail Shaik" (separate `div` layers, not one string)
- **Font:** Minecraft.ttf (local, `public/fonts/`) — see §2 Typography exception
- **Position:** `left: 3.5rem` desktop / `left: 2rem` mobile; `top: 1.5em`. Second line indented `2ch` via left margin so "S" in "Suhail" sits under the midpoint of the two "e"s in "Zeeshaan"
- **Color / glow:** acid green, dimmed to `brightness(0.65)` on both text and glow, color-matched to the floor-crack glow (`#ccff62`-adjacent) rather than the terminal's full-brightness `#39ff14`
- **Z-index:** `z-index: 1` — placed *behind* the statue (not above it as originally planned), with the header positioned so its bottom margin sits just above the statue's raised elbow

**Original plan (superseded, kept for reference):**
~~Single line "Zeeshaan Suhail Shaik" in JetBrains Mono, full-brightness `#39ff14`, `top: 2rem; left: 2rem`, z-index above statue but below terminal, letter-spacing `0.05em`–`0.1em`, text-shadow `0 0 8px #39ff14, 0 0 16px rgba(57, 255, 20, 0.5)`.~~ Replaced by the as-built spec above — the two-line stacked layout with the dimmed glow and behind-statue z-index reads better against the statue's raised arm and doesn't compete with the terminal as the brightest green element.

- Optional (future, still open): subtle scan-line flicker on hover for CRT effect (deferred to Piece 3b or later)

**Typewriter animation (locked 2026-07-11, Piece 2a Revisions Part 4):**
- The hero name types itself in and deletes itself in a continuous terminal-style loop —
  layered on top of the as-built static spec above, not a replacement for it (font, color,
  position, z-index all stay as already specified).
- **Sequence, in order:**
  1. "Zeeshaan" types in character by character on line 1
  2. Brief pause (~300ms)
  3. "Suhail Shaik" types in character by character on line 2
  4. Full hold with both lines complete (~1.8s)
  5. "Suhail Shaik" deletes character by character (reverse of how it typed — line 2 first)
  6. Brief pause (~300ms)
  7. "Zeeshaan" deletes character by character
  8. Brief pause at fully empty (~600ms), then loop back to step 1
- **Speed:** ~80ms per character while typing, ~50ms per character while deleting (deleting
  reads faster/snappier than typing, standard terminal-effect convention)
- **Cursor:** a blinking thin vertical bar/block cursor, dimmed acid-green (matching the
  hero text's `brightness(0.65)` glow), positioned at the end of whichever line is currently
  being typed or deleted. Continues blinking during the pause states too (idle terminal
  cursor blink), including at the fully-empty pause.
- **Layout stability:** reserve the full two-line height/position from the start (i.e. line
  2's container occupies its space even while empty during line-1 typing/step 8's pause) so
  nothing shifts vertically as characters are added/removed — this matters here specifically
  because the hero name sits directly behind the statue's raised elbow (`z-index: 1`,
  per the positioning above), and any layout jump would visibly disturb that alignment.
- **Implementation:** a small custom typewriter hook/effect (`setInterval`/`setTimeout`
  chain or `requestAnimationFrame`, driven by React state) rather than a GSAP TextPlugin
  dependency (TextPlugin requires a Club GreenSock license, avoid introducing that
  requirement for this). Loop runs continuously — no interaction needed to trigger it.
- **Note for later:** this animation should eventually be gated behind
  `prefers-reduced-motion` as part of Piece 6 (mobile/accessibility pass) — not required now,
  but keep the implementation simple enough that wrapping it in a reduced-motion check later
  is a small change, not a rewrite.

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
- [x] Resume scroll sprite (wall-mounted, linked to `/resume.pdf`)
- [x] Crumpled paper texture overlay (`/assets/textures/paper-crumple.png`, multiply blend, 0.15 opacity)
- [ ] Torn-edge mask/PNG (for section edges) — optional, may use clip-path instead
- [ ] Animated sprites for timeline (Experience section) — pending research & generation
- [x] Resume PDF file (`/public/resume.pdf`)
- [x] Minecraft.ttf local font file (`public/fonts/`) — hero name only
- [ ] Custom cursor SVG(s) — crosshair default + crosshair-active hover state (see §2 Cursor)

---

## 12. Decisions (locked)
- **Accent color:** acid green `#39ff14`
- **Statue:** 2D for now (see §13 for approach)
- **Framework:** Next.js (App Router)
- **Hero name font:** Minecraft.ttf (local), dimmed acid-green glow (`brightness(0.65)`), two-line stacked, z-index behind statue — see §7
- **Hero name animation:** continuous typewriter loop — sequential type-in (line 1 then line 2), reverse-order delete (line 2 then line 1), blinking dimmed-green cursor — see §7
- **Carousels:** Swiper.js or Framer Motion, auto-scroll on idle + manual buttons
- **Timeline:** Horizontal, with animated sprite support (sprites TBD)
- **Footer:** Monospace, minimal, museum/cyber aesthetic — built, see `BUILD_LOG.md`
- **Cursor:** custom thin acid-green crosshair, global, with filled-center-dot hover state on interactive elements — see §2
- **Scrollbar:** styled to match palette — near-black track, dimmed acid-green thumb — see §2
- **Scroll stack transition:** stationary-dim, no scale — see §14
- **Terminal:** command set `help`, `cd <section>`, `ls`, `whoami`; draggable; starts
  minimized; opens via clicking a back-wall painting trigger; renders in its own top-level
  stacking context so nothing (scroll-stack, later animations) can ever cover it while open;
  has a minimize button — see §15

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

---

## 14. Scroll Stack / Depth Layering (Piece 2b)

**Locked (2026-07-11), corrected (2026-07-11), confirmed working (2026-07-11):** the first Piece 2b build scaled the
outgoing section down (`1.0` → `0.94`) while dimming it, which reads as the page *moving
away* rather than staying put. That's not the intended effect — corrected spec below removes
scale entirely.

Every transition — gallery → About, About → Skills & Certs, and so on through all 5 sections
— stacks sequentially, book-style, rather than scrolling the outgoing section off-screen.

**Behavior:**
- Each section (including the gallery hero) pins in place (`position: sticky` or a GSAP
  ScrollTrigger pin) and **stays exactly where it is, at full size, for the rest of the
  scroll** — no scale transform, no repositioning, no shrinking.
- As the next section scrolls up and covers it, the outgoing section **dims in place**
  (reduced brightness/opacity, e.g. `brightness(0.6)` and/or `opacity: ~0.7`) — the only
  change to the outgoing section is dimness. It should feel like a page going dull under a
  new page laid on top of it, not a page zooming backward.
- The incoming section slides up from below and physically covers the dimmed section
  underneath — the stack effect comes entirely from the covering + dimming, not from any
  motion or scale on the section being left behind.
- This applies uniformly across the whole scroll sequence: Gallery → About → Skills & Certs
  → Projects → Experience → Domains of Study, each stacking on the last.
- Sections keep their existing per-section identity (yellowed paper background, crumpled
  texture overlay) — the stack effect governs the *transition*, not the section styling
  itself.
- The existing Zustand `currentSection` + Intersection Observer + URL sync stays as the
  source of truth for which section is "active"; the stack is a visual layer on top of that,
  not a replacement for the state model.
- "Return to Gallery" (and any future terminal `cd` commands) should reverse cleanly through
  the stack rather than jumping — i.e. scrolling back up un-stacks sections in reverse order,
  and previously-dimmed sections should brighten back up as they're revealed.

**Technical approach:**
- Primary candidate: GSAP ScrollTrigger with `pin: true` per section, animating only the
  outgoing section's `filter`/`opacity` (no `scale`/`transform`) as the next section's scroll
  progress increases, layered with the existing Lenis smooth-scroll setup.
- Alternative: CSS `position: sticky` sections with scroll-linked filter/opacity driven by
  Intersection Observer ratios or a Lenis scroll listener — this is what was actually used
  in the first build; keep this approach, just drop the scale transform from it.
- Whichever approach is used, it needs to coexist with the existing `isProgrammatic`
  scroll-flag pattern so "Return to Gallery" / future terminal navigation don't fight the
  pin/stack animation.

**Deferred to later pieces (do not build now):**
- Paper ball unfold animation (Piece 3b) will need to be re-checked against this stack
  model once both exist, since it also animates the gallery → section transition — Piece 3b
  should build *on top of* the stack model established here, not compete with it.

---

## 15. Terminal (Piece 3)

**Locked (2026-07-11).**

### Command set (first pass — minimal, expand later)
- `help` — lists available commands
- `cd <section>` — navigates to a section (writes to the same `currentSection` Zustand
  store the paper balls and scroll already use), e.g. `cd about`, `cd projects`
- `ls` — lists the 5 navigable sections (the same set `cd` accepts), styled like a directory
  listing (section keys, one per line or column, in keeping with the terminal-oracle
  aesthetic)
- `whoami` — prints a short identity line
- Unknown command → a short "command not found" style error line, in keeping with the
  terminal-oracle aesthetic (not a generic browser-console error)
- Still deliberately excluded for now: `cat <section>`, `clear` — add in a later pass once
  this set is working end-to-end

### Open/close trigger
- Terminal starts **minimized/closed** on page load — not visible by default.
- **Trigger:** one of the existing back-wall photo frames on the right side of the gallery
  (already baked into `gallery-background.png`, per §3 layer 1 — the tech-stack frame
  content itself is still a pending asset) becomes a clickable hotspot. Clicking it opens
  the terminal.
- Since the frame's real content isn't ready yet, use a subtle acid-green hover glow +
  the existing crosshair "active" cursor state (filled center dot, per §2 Cursor) as the
  interactive cue on hover — same treatment as paper balls and the resume scroll. No new
  visual asset needed for this task; swap in real frame art later without touching the
  click logic.
- Clicking the frame again (or a close/minimize control in the terminal's own chrome, see
  below) closes/minimizes the terminal back down.

### Window behavior
- **Draggable:** react-rnd or interact.js (see §5) — the terminal can be dragged anywhere
  within the viewport after opening.
- **Style:** floating Mac-style window per §3/§1 — title bar with traffic-light dots
  (plain colored circles are fine visually), monospace body text (JetBrains Mono / IBM Plex
  Mono, matching §2 Typography), acid-green text on a near-black terminal background,
  consistent with the existing accent-color discipline.
- **Shadow:** a small, thin drop shadow around the window edges (e.g.
  `box-shadow: 0 0 12px rgba(0,0,0,0.5)` or similar — subtle, just enough to separate it
  visually from whatever is behind it, not a heavy "digital-clean" shadow per the general
  no-drop-shadow texture rule elsewhere on the site — the terminal is the one exception,
  since it's meant to read as a physical floating object).
- **Position on open:** appears front-and-center-ish per the original scene sketch (§3) —
  exact resting position is Antigravity's call, just make sure it doesn't spawn directly on
  top of the statue or fully off-screen.
- **Z-index — absolute top layer (locked 2026-07-11):** once open, the terminal must render
  above *everything* on the page, with no exceptions — not just the statue/paper
  balls/hero name, but also the scroll-stack transition layers (Piece 2b) and, later, the
  paper-ball unfold animation (Piece 3b). No animation or transition anywhere on the site
  should ever visually cover or clip the terminal while it's open. In practice this likely
  means rendering the terminal via a React portal to a dedicated top-level DOM node (e.g.
  directly under `<body>`, sibling to the main scroll container) rather than inside the
  scroll-stack section tree, so it sits in its own stacking context that scroll-stack
  z-index values and future animations can't accidentally stack above. Confirm this
  approach works with whatever layout structure Piece 2b already put in place.
- **Minimize button (locked 2026-07-11):** the terminal's title bar has an explicit minimize
  control (can reuse the traffic-light dot styling — doesn't need to be a separate button
  shape). Clicking it hides the terminal back to its initial invisible state, same as if it
  had never been opened. This is in addition to, not instead of, the back-wall painting
  trigger — clicking the frame again should also still toggle it closed/open.

### State management
- Terminal open/closed state and command history are **UI state, not navigation state** —
  keep this separate from `navigationStore`'s `currentSection` (a small dedicated store or
  local component state is fine; don't conflate the two). `cd <section>` commands still
  write through to the existing `currentSection` store exactly like a paper ball click does.
- Terminal open/close and drag position should not interfere with the existing
  `isProgrammatic` scroll-flag pattern used by "Return to Gallery" and the scroll-stack
  (Piece 2b) — the terminal floats independently of scroll position once open.
