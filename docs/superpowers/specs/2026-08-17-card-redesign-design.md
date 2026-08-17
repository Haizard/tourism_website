# Design: "Safari Luxe" — Layered Glass + Glow Card & Pages Redesign

Date: 2026-08-17
Status: Approved by user (2026-08-17)

## Overview

Redesign the marketing card components and the section backdrops that host them
to achieve a richer, premium "cinematic adventure" feel — using layered glass,
gradient accents, colored glows, and refined micro-interactions. The redesign
uses the **existing** tailwind palette (teal `#0d9488`, yellow `#eab308`,
slate-900, ivory) — **no token color overhaul**.

## Decisions (from user dialogue)

- **Direction:** Refine current palette — no color token overhaul.
- **Scope:** All card components across all pages (not just core cards).
- **Aesthetic:** Layered glass + glow (glassmorphism, gradient borders, colored
  glow shadows, lift micro-interactions).
- **Dark/light:** Cards adapt to their host section — image-dominant cards keep
  dark cinematic gradients over photos; content cards become elegant white
  glass; dark sections get dark glass. Alternating dark/ivory rhythm preserved.
- **Micro-interactions:** Include hover-revealed "Book Now" CTAs on package
  cards and pulsing "Limited Spots" badges.
- **Backdrops:** Also refine section backgrounds with subtle radial gradient
  washes + faint texture so glows pop. Keep page hero headers cinematic.
- **Implementation approach:** Token-driven shared primitives — extend tailwind
  config + Card.jsx primitive, then apply tokens across all cards.

## Section 1 — Design tokens & shared utilities

### tailwind.config.js (additive only, no color overrides)

`theme.extend` additions:

- `boxShadow`:
  - `glow-primary`: `0 20px 60px -15px rgba(13,148,136,0.35)`
  - `glow-gold`: `0 20px 60px -15px rgba(234,179,8,0.30)`
  - `glow-accent`: `0 20px 60px -15px rgba(249,115,22,0.35)`
- `animation`:
  - `pulse-soft`: `pulseSoft 1.6s ease-in-out infinite`
- `keyframes`:
  - `pulseSoft`: `0%,100%` -> `{ opacity: 1, transform: scale(1) }`;
    `50%` -> `{ opacity: 0.75, transform: scale(0.97) }`

### src/index.css (component layer)

- `.glass-light`: `bg-white/70 backdrop-blur-xl border border-white/40` plus a
  soft layered shadow.
- `.glass-dark`: `bg-white/5 backdrop-blur-xl border border-white/10`.
- `.gradient-border`: 1px gradient border (teal -> gold) via
  `background-clip: padding-box / border-box` technique, used as an accent line
  on light cards (top edge) and on CTAs.
- `.card-lift`: base transition + glow shadow on hover (color varies by card
  via `glow-*` utilities). The vertical lift is NOT done via CSS translate —
  it stays in the framer-motion `whileHover` on `Card.jsx` because framer-motion
  writes an inline `transform` that would override a CSS transform.
- `.section-wash-light`: subtle radial gradient wash (soft teal/gold tints on a
  warm ivory base) for light sections.
- `.section-wash-dark`: deep teal-black radial gradient wash for dark sections.
- Respect `prefers-reduced-motion` (disable lift/zoom animations).

## Section 2 — Card.jsx primitive

Refactor `src/components/UI/Card.jsx` to be variant-aware while keeping its
current framer-motion entrance (fade + slide-up) and moving hover-lift into the
primitive.

Props:

- `variant = "light" | "dark" | "image"` (default `"light"`)
  - `light`: white glass card (`.glass-light`), subtle border, hover glow.
  - `dark`: dark glass card (`.glass-dark`), white/10 border, hover glow.
  - `image`: transparent container for image-dominant cards; provides a glow
    ring + lift on hover without its own background.
- `glow = "primary" | "gold" | "accent" | "none"` (default `"primary"`) — the
  hover shadow color (`shadow-glow-primary` etc.), applied via CSS hover classes.
- `className`, `delay` passthrough (existing API preserved).
- Hover lift stays in framer-motion `whileHover={{ y: -8 }}` (inline transform);
  glow shadow applied via CSS `hover:` classes (no conflict).

All consumers get consistent lift + glow for free. Existing call sites that
pass `className` for padding/rounding continue to work.

## Section 3 — Card component redesigns

### PackageCard (`src/components/Blogs/PackageCard.jsx`)

- Image header: on hover, image zooms (scale-110) and a dark gradient deepens.
- **"Book Now" pill** slides up over the image bottom on hover (translate-y from
  below, opacity fade-in), linking to the itinerary route (card is a `<Link>`).
- Price chip becomes a glass chip (`.glass-light`, backdrop-blur).
- **Pulsing "Limited Spots" badge**: when `spotsLeft <= 3`, render a red
  badge (`bg-red-500/90 text-white`) with `animate-pulse-soft` + a soft red
  glow. Placed in the badge row.
- Group-tour progress bar keeps the teal->gold gradient; container gets a
  subtle glass fill.
- Hover: teal glow (`shadow-glow-primary`) + lift, gradient accent top line
  appears.
- Footer arrow (`→`) keeps its existing behavior (bg turns teal on hover).

### BlogCard (`src/components/Blogs/BlogCard.jsx`)

- Light glass card; gold gradient top-accent line (`.gradient-border` on the
  top edge).
- "Read Story" reveal on image hover retained, refined with a gold underline
  sweep.
- Richer author row: avatar gets a gradient ring; date stays subtle.
- Hover: gold glow (`shadow-glow-gold`) + lift.
- Footer "Explore →" retained; decorative dots tint gold on hover.

### PlaceCard (`src/components/Places/PlaceCard.jsx`)

- Image card with hover CTA **"View Journey"** sliding up over a deeper caption
  gradient.
- Glow ring on hover (`shadow-glow-primary`) + image zoom.
- Location eyebrow + title treatment retained, refined with a teal glow
  underline on the title.

### Trending (`src/components/Home/Trending.jsx`)

- Dark glass cards over images (`.glass-dark` overlay); teal/gold glow on hover.
- Keep the auto-sliding carousel + indicators.
- Badges get glass treatment; pulsing "Limited Spots" badge on group tours with
  low spots (spotsLeft <= 3).
- "From $X" price + arrow circle retained with glow.

### Features (`src/components/Home/Features.jsx`)

- White glass cards (`.glass-light`).
- Icon chips get gradient backgrounds + soft glow, per-feature accent color
  (teal/gold/orange mapping retained).
- Hover: lift + border glow.

### Testimonial (`src/components/Testimonial/Testimonial.jsx`)

- White glass card; gold stars; floating serif quote glyph; gradient accent
  line on top edge.
- Hover: subtle lift + gold glow.
- Slider behavior (react-slick) unchanged.

### Banner (`src/components/Banner/Banner.jsx`)

- Glow blob behind the image retained/enhanced.
- Stat badge ("500+ Happy Adventurers") becomes a glass badge.
- Amenity chips become glass chips (`bg-white/5 border-white/10`).
- CTA button keeps teal gradient + `cinematic-shadow`.

## Section 4 — Section backdrops & page-level cards

### Section backgrounds (rich backdrops)

- Light sections (Features, BlogsComp, PackagesComp, Testimonial, Places, etc.)
  get `.section-wash-light` (radial teal/gold tints over warm ivory).
- Dark sections (Trending, Banner) get `.section-wash-dark` (deep teal-black
  radial).
- Page hero headers (Packages/Blogs/Destinations/About) remain cinematic
  (unsplash bg + dark overlay); badges get glass treatment.

### PackagesComp (`src/components/Blogs/PackagesComp.jsx`)

- Section backdrop upgraded.
- No-results state becomes a glass card.
- **FilterSidebar** (`src/components/Blogs/FilterSidebar.jsx`) becomes a glass
  card (white glass, sticky behavior retained).

### Destinations (`src/pages/Destinations.jsx`)

- Inline destination cards adopt PlaceCard-style image card with hover CTA +
  glow.
- Section backdrop + header refined.

### DestinationDetail (`src/pages/DestinationDetail.jsx`)

- Sidebar cards: "Best Time to Visit" -> dark glass; "Wildlife Calendar" &
  "Tours Here" -> white glass with glow accents.
- Gallery tiles get hover zoom + rounded glow.

### About (`src/pages/About.jsx`)

- "The Visionaries" panel -> glass card with avatar glow.
- Map card retains glass-dark footer bar; location/email chips get glass
  treatment (replace emoji with lucide icons if trivial, else keep).
- Hero + text column styling retained.

### TailorMade (`src/pages/TailorMade.jsx`)

- Form card -> white glass with gradient border; sidebar keeps teal gradient
  (refined padding/typography).
- Inputs retain focus ring; service-toggle chips get subtle glass.

### PackagesPage / Blogs page headers

- Keep cinematic headers; badges get glass treatment.

## Accessibility & performance guardrails

- `prefers-reduced-motion` respected: disable lift/zoom/pulse animations.
- Focus-visible states on interactive cards/buttons.
- `cursor-pointer` on all clickable cards.
- Light mode text contrast >= 4.5:1 (maintain existing text colors; verify no
  regressions on glass surfaces).
- No new runtime dependencies. Performance: hover transforms use
  transform/opacity only (compositor-friendly).
- Responsive: cards remain correct at 375px / 768px / 1024px / 1440px.

## Out of scope

- Color token overhaul (kept current palette).
- Backend changes.
- New pages/sections (stat counters, Instagram feed from the old plan are not
  in this pass).
- Admin dashboard styling (functional tool, not marketing surface).
- Navbar redesign.

## Testing

- Existing build: `npm run build` must pass (no TS/lint regressions in changed
  files; whole-repo lint has pre-existing ~125 errors that are out of scope).
- Manual verification on the running local preview (Vite :5173 + backend :5000)
  at desktop and mobile widths.
- Verify hover CTAs, pulsing badges, glows, and that all links still navigate.
