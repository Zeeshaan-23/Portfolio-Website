# Task for Antigravity — Piece 2b: Scroll Stack / Depth Layering

## Context
Read `DESIGN_UPDATED.md` first — it is the current source-of-truth design spec. §14 (Scroll
Stack / Depth Layering) has just been added and is the primary spec for this task. §4
(Navigation Model) has a small update referencing it too. Treat `DESIGN_UPDATED.md` as
authoritative; if anything here conflicts with it, `DESIGN_UPDATED.md` wins.

Also check `BUILD_LOG.md` for the current state of the scroll/navigation system before
touching anything — specifically the `isProgrammatic` scroll-flag pattern (Piece 1 Revisions
Part 3) and the Intersection Observer / URL sync setup (Piece 1 Revisions Part 2), since this
task builds on top of both rather than replacing them.

This is **Piece 2b** — it replaces the current flat scroll transition model with a
sequential, book-style stack. **Scope this tightly to the scroll/transition mechanics only.**
Do not touch section content, the hero name, statue, paper balls, resume scroll, footer,
cursor, or scrollbar styling — those are done and should not regress. Do not start on the
terminal (Piece 3), section content components (Piece 3a), or paper ball unfold (Piece 3b).

## Scope for this task

1. **Stack transition, applied to every scroll step in sequence:**
   Gallery → About → Skills & Certs → Projects → Experience → Domains of Study. Each section
   (including the gallery hero) pins in place while the next section scrolls up and over it.

2. **Parallax-recede treatment on the outgoing section**, driven by scroll progress into the
   next section:
   - Scale down slightly (`0.92`–`0.96` range — pick what looks right, tune from there)
   - Dim it (reduced brightness/opacity — e.g. `brightness(0.6)` and/or `opacity: ~0.7`)
   - This should feel like a page being turned under the next one, not a hard cut or a flat
     scroll-past

3. **Reversible in both directions** — scrolling back up should un-stack sections in reverse
   order cleanly, including the existing "Return to Gallery" behavior. Coordinate with the
   existing `isProgrammatic` flag in `navigationStore` so this doesn't fight programmatic
   scrolls the way the pre-Piece-1-Revisions-Part-3 version did.

4. **Keep the existing state model intact:** `currentSection` Zustand store, Intersection
   Observer section detection, and URL path sync all stay as-is functionally — this task adds
   a visual/scroll-mechanics layer on top, it does not replace how "current section" is
   determined.

5. **Technical approach:** primary candidate is GSAP ScrollTrigger with `pin: true` per
   section, animating the outgoing section's scale/filter/opacity as scroll progress
   advances, coexisting with the current Lenis smooth-scroll setup. If ScrollTrigger + Lenis
   pinning proves fragile with the existing section structure, a `position: sticky` +
   Intersection-Observer-driven-transform fallback is acceptable — use your judgment on
   which is more stable given the current codebase, but note which one you used and why in
   your summary.

## Explicitly out of scope for this task (later pieces / already done)
- Terminal window / command parsing (Piece 3)
- Section content and components — carousels, timeline (Piece 3a)
- Paper ball unfold animation (Piece 3b) — this will need to be reconciled with the stack
  model once it's built, but don't build it now
- Hero name, statue, paper balls, resume scroll, footer, cursor, scrollbar — already built,
  do not modify

## Acceptance criteria
- `npm run dev` runs cleanly with no console errors
- Scrolling down from the gallery hero through all 5 sections shows each new section
  stacking on top of the previous one, with the outgoing section visibly scaling down and
  dimming as it recedes
- Scrolling back up reverses the stack cleanly in the correct order
- "Return to Gallery" still works correctly and doesn't fight the new scroll/pin behavior
- `currentSection` state and URL still update correctly at each step (no regressions to the
  existing Piece 1/2 navigation sync)
- No visual or functional regressions to hero name, statue, paper balls, resume scroll,
  footer, cursor, or scrollbar
- Committed with clear, incremental commit messages, not one giant commit

## After completing
Summarize what you built, which technical approach you used (ScrollTrigger pin vs. sticky
fallback) and why, flag any tuning values (scale/dim amounts) you had to eyeball, and stop
for review before starting Piece 3 (terminal navigation).
