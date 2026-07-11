# Piece 2a — Revisions Part 2: Hero Name Typography & Resume Scroll Refinement

## Context
This is a targeted revision following Piece 2a implementation. Only the hero name typography/positioning
and resume scroll positioning are being adjusted. Do not touch any other elements.

## Scope

### 1. Hero Name — Typography & Positioning Adjustments

The hero name needs significant repositioning and sizing changes to match the visual intent.

**Text layout (CRITICAL):**
- Line 1: "Zeeshaan" (on its own line)
- Line 2: "Suhail Shaik" (on a second line below)
- Use a `<div>` or `<p>` with line breaks, or multiple elements, whichever is cleaner

**Positioning & Sizing:**
- Positioning: `position: absolute; top: 1rem; left: 0` (start from the **left edge**, minimal or zero left margin)
- Z-index: positioned **behind the statue** so the text extends visually under it (e.g. `z-index: 5` if statue is `z-index: 10`)
- Size: **very large** (~7rem–8rem, responsive) — should be long and wide enough to extend well past the statue centerline
- Width: allow text to naturally extend across; no max-width constraint (let it go behind statue freely)
- Line-height: tight (0.85–0.95) to keep the two lines compact and visually cohesive

**Typography & Styling (keep as-is):**
- Font: Pixel OS (Google Fonts)
- Color: Acid green `#39ff14`
- Text-shadow glow: minimal — `text-shadow: 0 0 4px #39ff14`
- Letter-spacing: default/tight (Pixel OS character spacing)

---

### 2. Resume Scroll — Positioning Refinement

Minor adjustments to ensure the resume scroll is properly positioned on the right wall and dimmed appropriately.

**Positioning:**
- Position: right side wall, closer to the right edge (not centered)
- Vertical position: naturally centered or positioned as visually balanced against the hero name
- Ensure scroll is fully visible without being cut off by viewport edge

**Dimming (finalize):**
- Apply dimming filter: `filter: brightness(0.70) saturate(0.85);`
- Hover state: `filter: brightness(0.85) saturate(0.85) drop-shadow(0 0 8px #39ff14);`
- Result: scroll blends into dim gallery lighting at rest, brightens slightly with acid green glow on hover

---

## Acceptance criteria
- Hero name "Zeeshaan" appears on line 1, "Suhail Shaik" on line 2 (vertically stacked)
- Text starts from the left edge and extends significantly across (large ~7rem–8rem size)
- Name is positioned behind the statue (z-index lower than statue)
- Resume scroll is positioned on the right wall, properly dimmed, hover effects working
- No other elements or styling are affected
- Code committed with message: `fix(design): adjust hero name layout and size, refine resume scroll positioning`

## After completing
Update `BUILD_LOG.md` and await review before proceeding to next pieces.
