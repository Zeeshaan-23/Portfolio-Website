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
state.

---

## 2. Visual Language

### Palette
| Role | Color | Notes |
|---|---|---|
| Base / walls | Concrete grey `#8a8a86` → `#6e6e6a` | Matches museum reference images |
| Marble / statue | Off-white cream `#e8e2d4` | |
| Paper (old library) | Yellowed cream `#e6dcc0` | Page backgrounds |
| Ink / body text | Near-black `#1c1a17` | |
| Accent (terminal / glow) | Amber `#ffb000` **or** acid green `#39ff14` | Pick ONE as the single accent, use sparingly — cursor, binary stream, spotlight glow, hover states |
| Shadow / depth | `#111111` at low opacity | Gallery dimness |

Rule of thumb: 90% neutral (concrete/marble/paper), 10% accent. The accent color is the
"electricity" — it should only appear where something digital is happening (terminal,
cracks, ASCII glitch, hover states).

### Typography
- **Headers / name:** distressed classical serif — *Special Elite* or *IM Fell English* (Google Fonts)
- **Body / UI / terminal:** monospace — *JetBrains Mono* or *IBM Plex Mono*
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
│  [frame]        [ STATUE ]        [frame]   │  ← back wall, tech-stack photo frames
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
2. Spotlight cone (CSS radial-gradient or Three.js SpotLight) on the statue
3. Statue (marble render, right half normal / left half ASCII via clip-path split)
4. Cracks (SVG path from pedestal base fanning across floor)
5. Binary stream (chars animated along crack paths, upward, accent color)
6. Paper balls (5 total — one per nav section), scattered floor positions
7. Terminal window (floating, draggable or fixed, front-most)

**Nav sections (5 paper balls + terminal commands):**
1. About
2. Skills & Certs
3. Projects
4. Experience
5. Domains of Study / Interest

---

## 4. Navigation Model

Single source of truth: `currentSection` state (Zustand store).

Three input methods, all write to the same state:
- **Click** a paper ball → unfold animation → transition to section
- **Terminal command** (`cd projects`, `ls`, `cat about`, `whoami`, `help`) → same transition
- **Scroll** → scrolling past the gallery hero scrolls into section content

When a section opens: paper-ball unfold animation (scale 0.6→1 + rotation settle) →
crossfade/wipe into a full-page **yellowed old-paper background** with torn edges, content
typeset in monospace body / serif headers.

---

## 5. Tech Stack

- **Framework:** Next.js (App Router) — enables real per-section URLs (`/projects`, `/about`)
- **State:** Zustand (single `currentSection` store)
- **Scroll:** Lenis (smooth scroll) + GSAP ScrollTrigger
- **Animation:** GSAP (core) + MotionPath plugin (binary-along-crack animation)
- **Statue (current, 2D):** plain `<canvas>` + a custom luminance-to-ASCII utility, no external 3D library — see §9 for full pipeline
- **Statue (future, 3D — deferred):** Three.js or react-three-fiber with the official `AsciiEffect` addon, once/if we move off the 2D approach
- **Spotlight:** CSS radial-gradient (2D) for now; would become a real Three.js `SpotLight` only if we move to 3D
- **Paper ball physics (optional polish):** Matter.js — subtle roll-on-hover only, last priority
- **Draggable terminal (optional):** react-rnd or interact.js
- **Parallax on photo frames:** vanilla-tilt.js
- **Fonts:** Google Fonts — Special Elite / IM Fell English + JetBrains Mono / IBM Plex Mono

---

## 6. Build Order (piece by piece)

| # | Piece | Goal | Status |
|---|---|---|---|
| 1 | Static gallery + statue image + CSS spotlight + clickable paper balls (no animation yet, just nav working) | Core UX skeleton | ⬜ |
| 2 | Terminal component wired to same nav state | Second nav method works | ⬜ |
| 3 | Yellowed-paper page transitions + scroll-based nav | Third nav method + section styling | ⬜ |
| 4 | Crack SVG + binary MotionPath animation | Hero animation layer 1 | ⬜ |
| 5 | ASCII-split statue effect (Three.js) | Hero animation layer 2 (hardest, do last) | ⬜ |
| 6 | Mobile fallback (pre-rendered statue image/video instead of live Three.js, `prefers-reduced-motion` check) | Perf/accessibility pass | ⬜ |

Mark status as pieces complete; keep this table updated in `BUILD_LOG.md`.

---

## 7. Assets Needed (in progress — being generated separately)

- [ ] Gallery background (wall + floor, dim museum lighting) — static image, layered so statue/terminal can sit in front
- [ ] Photo frame contents (tech stack icons/logos) for back wall
- [ ] Statue — either a 3D model (preferred, for the ASCII split effect) or a high-res static image with a pre-split ASCII version if going 2D-only
- [ ] 5x crumpled paper ball sprites (can be one base texture reused, or unique per section)
- [ ] Yellowed old-paper texture (for section page backgrounds)
- [ ] Torn-edge mask/PNG (for paper panel edges)

---

## 8. Decisions (locked)
- **Accent color:** acid green `#39ff14`
- **Statue:** 2D for now (see §9 for approach — replaces the Three.js AsciiEffect pipeline in §5 until/unless we move to 3D)
- **Framework:** Next.js (App Router)

---

## 9. 2D Statue — ASCII Split Approach

Since we're not using Three.js/AsciiEffect yet, the ASCII half is generated client-side from
the SAME source image, not a separately generated "ASCII picture." This keeps the two halves
structurally aligned (same pose, same proportions) since they come from one file.

**Pipeline:**
1. Single statue PNG (marble render, plain/transparent background) is the only asset needed.
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
required, and can be swapped later for the Three.js live-render version without touching
layout code — same slot, same clip-path logic.

### Statue image generation prompt
Use with Midjourney, DALL-E, or SDXL/Stable Diffusion:

> A weathered classical Greek marble bust statue, head and shoulders, facing forward,
> dramatic single overhead spotlight, deep shadows, museum lighting, photorealistic marble
> texture with visible cracks and age, plain solid dark grey background, studio photography
> style, high detail, centered composition, 4k

**Settings to request/set:**
- Aspect ratio: portrait, roughly 3:4 or 2:3 (so it reads well centered on a pedestal)
- Plain/solid background (dark grey or black) so you can key it out or drop it straight onto
  the gallery background without a hard edge — ask for "transparent background" if your tool
  supports PNG alpha export (SDXL + background-removal tool, or Midjourney + remove.bg after)
- Avoid props, other figures, or text in frame — just the bust, centered

**File placement:**
```
/public/assets/statue/statue.png       ← the single source image, transparent bg preferred
```

The build script/component will look for exactly this path — keep the filename as `statue.png`
unless you update the reference in the component.
