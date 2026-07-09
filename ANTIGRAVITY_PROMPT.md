# Task for Antigravity — Piece 1: Gallery Skeleton

## Context
Read `DESIGN.md` in this folder first — it is the full design spec for this project
(concept, palette, typography, scene layout, tech stack, and decisions already locked in).
Treat it as the source of truth for every visual and technical choice. If anything in this
prompt conflicts with `DESIGN.md`, `DESIGN.md` wins.

This is a personal portfolio site built as an interactive museum-gallery scene. We are
building it **piece by piece** (see §6 of `DESIGN.md` for the full build order). This task
covers **piece 1 only** — do not build the terminal, crack/binary animation, or ASCII split
yet. Just get the static skeleton working end-to-end.

## Assets provided in this folder
- `DESIGN.md` — full design spec
- `/assets/gallery-background.png` — gallery wall + floor background
- `/assets/statue.png` — statue source image (plain/transparent background)
- `/assets/paper-ball-*.png` — crumpled paper sprites (one per nav section, or one reused
  base sprite — check what's provided and adapt)

If any listed asset is missing, use a clearly-labeled placeholder (solid color block with
a text label) in its place and flag it in your summary — do not block on missing assets.

## Git / commit workflow
- Commit at each logical checkpoint as you go (e.g. after project scaffolding, after the
  gallery background + statue render, after paper balls are positioned, after click
  navigation works) — do not batch this entire task into one commit at the end. I need a
  reviewable diff history.
- Use **Conventional Commits** style, professional and specific — not generic messages:
  - Format: `<type>(<scope>): <short summary>`
  - Types: `feat`, `fix`, `chore`, `style`, `refactor`
  - Good examples:
    - `feat(gallery): add hero scene with background, statue, and CSS spotlight`
    - `feat(nav): add Zustand currentSection store and paper ball click handlers`
    - `feat(nav): add placeholder section pages with serif/mono typography`
    - `chore(fonts): wire up Special Elite and JetBrains Mono via next/font`
  - Avoid vague messages like "update files," "wip," or "fixes."
- Do not push to a remote or open a PR unless I ask — local commits on the working branch
  are enough for this task.

## Scope for this task
1. **Set up the Next.js project** (App Router) per the stack in `DESIGN.md` §5.
2. **Gallery scene, hero view only:**
   - Full-viewport background using `gallery-background.png`
   - Statue image (`statue.png`) centered, positioned on a pedestal area, roughly
     scaled/placed per the layout described in `DESIGN.md` §3. No ASCII split yet — just
     the plain image for now.
   - A simple CSS radial-gradient spotlight cone over the statue (acid green `#39ff14`
     tint at low opacity, per §2 palette rules — accent used sparingly, just enough to
     suggest a light source)
   - 5 paper ball sprites scattered on the floor area, positioned so they don't overlap
     the statue or each other. Each one corresponds to a section: About, Skills & Certs,
     Projects, Experience, Domains of Study/Interest (see §3 nav sections list)
3. **Navigation (click only for this piece):**
   - Clicking a paper ball should trigger a placeholder transition (simple fade is fine
     for now) to a blank page that just displays the section name in large text, using the
     typography rules from §2 (serif header, mono body). This is a stub — full yellowed-
     paper page styling comes in piece 3, don't build it now.
   - Set up the navigation state as a single Zustand store (`currentSection`) per §4, even
     though only click-based nav exists yet — this store is what the terminal and scroll
     nav will plug into in later pieces, so the shape needs to be right from the start.
4. **Fonts:** wire up Google Fonts per §2 (Special Elite or IM Fell English for headers,
   JetBrains Mono or IBM Plex Mono for body/UI) — apply them now even though most text is
   still placeholder.
5. **Folder structure:** keep assets under `/public/assets/...` and components organized
   sensibly (e.g. `/components/Gallery/`, `/components/PaperBall/`, `/store/`). Use your
   judgment on exact structure but keep it conventional for a Next.js App Router project so
   it's easy for me to navigate by hand later.

## Explicitly out of scope for this task (later pieces)
- Terminal window / command parsing
- Scroll-based navigation
- Yellowed old-paper page backgrounds and full section content styling
- Crack SVG + binary MotionPath animation
- ASCII-split statue effect (canvas/luminance pipeline from `DESIGN.md` §9)
- Mobile fallback / `prefers-reduced-motion` handling

Don't build ahead into these — I want to review and commit each piece separately.

## Acceptance criteria
- `npm run dev` runs cleanly with no console errors
- Gallery hero view renders with background, statue, spotlight, and 5 positioned paper balls
- Clicking each paper ball navigates to its distinct placeholder section page and back
- Fonts are visibly applied (not falling back to system default)
- Code is committed with clear, incremental commit messages (not one giant commit) so I can
  review the diff history

## After completing
Summarize what you built, flag any asset gaps or design ambiguities you had to make a
judgment call on, and stop for my review before starting piece 2 (terminal navigation).
