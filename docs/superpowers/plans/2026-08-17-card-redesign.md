# "Safari Luxe" Card & Pages Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all marketing cards and their host sections with layered glass, gradient accents, colored glows, and refined micro-interactions, using the existing tailwind palette.

**Architecture:** Additive design tokens in `tailwind.config.js` + shared CSS utilities in `src/index.css`; refactor the `Card.jsx` primitive to be variant-aware; then restyle each card component and page-level card to consume the tokens. Sections get radial "wash" backdrops.

**Tech Stack:** React 18, Vite 5, Tailwind 3.3, Framer Motion 12, lucide-react, react-icons.

## Global Constraints

- **Palette is frozen:** primary `#0d9488`, secondary `#eab308`, background `#0f172a`, surface `#f8fafc`, accent `#f97316`. Do NOT override color tokens.
- **No new dependencies** (runtime or dev).
- **Lint gate:** whole-repo `npm run lint` has ~125 pre-existing errors (out of scope). For this plan, lint only changed files:
  `npx eslint <file> --max-warnings 0` — must pass with 0 warnings.
- **Build gate:** `npm run build` must pass after each task.
- **No unit-test framework exists** for components (no vitest/jest/testing-library). Verification for styling tasks = eslint (changed files) + `npm run build` + manual check on the running preview (`npm run dev`, Vite :5173 proxying `/api` to :5000).
- **Framer Motion transform rule:** hover vertical lift lives in framer-motion (`whileHover`), NOT CSS `transform`, because framer-motion writes an inline transform that overrides CSS transforms. CSS handles only `box-shadow` transitions.
- **Accessibility:** respect `prefers-reduced-motion` (disable pulse animations + framer hover lift); keep text contrast >= 4.5:1 on light surfaces; `cursor-pointer` on clickable cards; focus-visible states.
- **File paths** are relative to repo root `/workspace`.
- **Do not touch** the admin pages, backend, navbar, or footer.

---
---

## Task 1: Design tokens & shared CSS utilities

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

**Interfaces:**
- Produces (used by all later tasks):
  - Tailwind shadows: `shadow-glow-primary`, `shadow-glow-gold`, `shadow-glow-accent`
  - Tailwind animation: `animate-pulse-soft`
  - CSS classes: `.glass-light`, `.glass-dark`, `.gradient-border`, `.top-accent`, `.card-lift`, `.section-wash-light`, `.section-wash-dark`

- [ ] **Step 1: Add design tokens to `tailwind.config.js`**

Edit `theme.extend` so it reads exactly:

```js
      boxShadow: {
        "glow-primary": "0 20px 60px -15px rgba(13,148,136,0.35)",
        "glow-gold": "0 20px 60px -15px rgba(234,179,8,0.30)",
        "glow-accent": "0 20px 60px -15px rgba(249,115,22,0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "pulse-soft": "pulseSoft 1.6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(0.97)" },
        },
      },
```

- [ ] **Step 2: Add component utilities to `src/index.css`**

Inside the `@layer components` block, add after the existing `.section-light` rule:

```css
  /* Glass surfaces */
  .glass-light {
    @apply bg-white/70 backdrop-blur-xl border border-white/40;
    box-shadow: 0 8px 32px -12px rgba(15, 23, 42, 0.12);
  }

  .glass-dark {
    @apply bg-white/5 backdrop-blur-xl border border-white/10;
  }

  /* 1px gradient border ring (mask technique — works over any bg) */
  .gradient-border {
    position: relative;
  }

  .gradient-border::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, #0d9488, #eab308);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  /* Top accent line (gold gradient) for cards */
  .top-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #0d9488, #eab308, #0d9488);
  }

  /* Shadow-only transition (transform is owned by framer-motion) */
  .card-lift {
    transition: box-shadow 0.3s ease;
  }

  /* Section backdrop washes */
  .section-wash-light {
    background-color: #f5f0ec;
    background-image: radial-gradient(60rem 30rem at 85% -10%, rgba(13, 148, 136, 0.08), transparent 60%),
      radial-gradient(50rem 25rem at 10% 110%, rgba(234, 179, 8, 0.08), transparent 60%);
  }

  .section-wash-dark {
    background-color: #0e1a17;
    background-image: radial-gradient(60rem 30rem at 85% -10%, rgba(13, 148, 136, 0.14), transparent 60%),
      radial-gradient(50rem 25rem at 10% 110%, rgba(234, 179, 8, 0.07), transparent 60%);
  }
```

- [ ] **Step 3: Add reduced-motion guard to `src/index.css`**

At the very end of the file (after the `@layer utilities` block), append:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Verify tokens build**

Run: `npm run build`
Expected: build succeeds. Confirm the new classes are generated: `npx tailwindcss -c tailwind.config.js -i src/index.css -o /dev/null` runs without errors.

- [ ] **Step 5: Lint changed files**

Run: `npx eslint src/index.css tailwind.config.js --max-warnings 0`
Expected: PASS (no warnings).

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.js src/index.css
git commit -m "feat(ui): add glow shadows, glass, gradient-border, and section-wash tokens"
```

---
---

## Task 2: Variant-aware Card.jsx primitive

**Files:**
- Modify: `src/components/UI/Card.jsx`

**Interfaces:**
- Consumes: `shadow-glow-*`, `.glass-light`, `.glass-dark`, `.card-lift` (Task 1)
- Produces: `<Card variant="light|dark|image" glow="primary|gold|accent|none" lift={bool} delay className>`
  - Backward compatible: existing callers pass only `className`/`delay` and keep working.

- [ ] **Step 1: Rewrite `src/components/UI/Card.jsx`**

Replace the entire file:

```jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const Card = ({
  children,
  className = "",
  delay = 0,
  variant = "light",
  glow = "primary",
  lift = true,
}) => {
  const prefersReduced = useReducedMotion();

  const variants = {
    light: "glass-light shadow-lg",
    dark: "glass-dark shadow-lg",
    image: "border border-transparent",
  };

  const glows = {
    primary: "hover:shadow-glow-primary",
    gold: "hover:shadow-glow-gold",
    accent: "hover:shadow-glow-accent",
    none: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={lift && !prefersReduced ? { y: -8 } : undefined}
      className={`card-lift rounded-2xl overflow-hidden ${variants[variant]} ${glows[glow]} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
```

- [ ] **Step 2: Build & lint**

Run: `npm run build`
Expected: PASS.

Run: `npx eslint src/components/UI/Card.jsx --max-warnings 0`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/UI/Card.jsx
git commit -m "feat(ui): make Card variant-aware with glass, glow, and reduced-motion support"
```

---
---

## Task 3: PackageCard — Book Now hover CTA, pulsing Limited Spots, glass price chip

**Files:**
- Modify: `src/components/Blogs/PackageCard.jsx`

**Interfaces:**
- Consumes: `<Card variant glow>` (Task 2), `animate-pulse-soft`, `shadow-glow-primary` (Task 1)
- Produces: no new interfaces; visual/behavioral upgrade of the package card.

- [ ] **Step 1: Rewrite `src/components/Blogs/PackageCard.jsx`**

Replace the entire file:

```jsx
import { Link } from "react-router-dom";
import { IoLocationSharp, IoTimeOutline, IoPeopleOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import Badge from "../UI/Badge";
import Card from "../UI/Card";

const PackageCard = (props) => {
  const {
    image,
    title,
    location,
    price,
    description,
    tourType,
    category,
    isGroupTour,
    maxCapacity,
    currentBookings,
    launchDate,
  } = props;
  const spotsLeft = maxCapacity - currentBookings;
  const progress = (currentBookings / maxCapacity) * 100;
  const limited = isGroupTour && spotsLeft <= 3;

  return (
    <Link
      to={`/packages/${title}`}
      onClick={() => window.scrollTo(0, 0)}
      state={props}
      className="group block h-full"
    >
      <Card
        variant="light"
        glow="primary"
        className="relative h-full border-none shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-700 rounded-[40px] overflow-hidden"
      >
        <div className="relative h-48 md:h-72 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            <Badge variant="luxury" className="backdrop-blur-md bg-white/10 border-white/20 text-white uppercase font-black text-[9px] tracking-widest px-3 py-1">
              {tourType || "Safari"}
            </Badge>
            <Badge variant="secondary" className="backdrop-blur-md bg-primary/20 border-primary/20 text-white uppercase font-black text-[9px] tracking-widest px-3 py-1">
              {category || "Luxury"}
            </Badge>
            {limited && (
              <span className="animate-pulse-soft inline-flex items-center gap-1.5 bg-red-500/90 text-white border border-red-300/50 shadow-[0_0_18px_rgba(239,68,68,0.6)] px-3 py-1 rounded-full text-[9px] uppercase font-black tracking-widest">
                Limited Spots
              </span>
            )}
          </div>

          {/* Location + title shift up on hover to make room for the CTA */}
          <div className="absolute bottom-6 left-6 right-6 transition-transform duration-500 group-hover:-translate-y-8">
            <div className="flex items-center gap-1.5 text-white/90 mb-2">
              <IoLocationSharp className="text-primary text-sm" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {location}
              </span>
            </div>
            <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
          </div>

          {/* Book Now pill slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <span className="inline-flex items-center justify-center w-full bg-primary text-white font-black uppercase tracking-widest text-xs py-3 rounded-full shadow-glow-primary">
              Book Now →
            </span>
          </div>

          <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl px-3 py-1 md:px-4 md:py-2 text-center transform group-hover:scale-110 transition-transform duration-500">
            <p className="text-[7px] md:text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">From</p>
            <p className="text-sm md:text-xl font-black text-primary leading-none">${price}</p>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {isGroupTour && (
            <div className="mb-6 bg-white/50 p-4 rounded-3xl border border-white/60 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-gray-900 tracking-widest">
                  <IoPeopleOutline className="text-primary text-sm" /> Confirmed Group
                </span>
                <span className="text-[9px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {spotsLeft} Left
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
              {launchDate && (
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                  <IoTimeOutline className="text-secondary" /> Starts: {new Date(launchDate).toLocaleDateString()}
                </div>
              )}
            </div>
          )}

          <p className="hidden md:line-clamp-2 text-gray-500 text-sm leading-relaxed font-medium mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
            {description}
          </p>

          <div className="flex justify-between items-center pt-6 border-t border-gray-50">
            <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
              View Itinerary
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center transform group-hover:bg-primary group-hover:translate-x-1 transition-all">
              →
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PackageCard;
```

- [ ] **Step 2: Build & lint**

Run: `npm run build`
Expected: PASS.

Run: `npx eslint src/components/Blogs/PackageCard.jsx --max-warnings 0`
Expected: PASS.

- [ ] **Step 3: Manual check on running preview** (if `npm run dev` is up)

Visit `/packages`: card image zooms on hover, title shifts up, teal "Book Now" pill slides up, price chip is translucent. If a group tour has `spotsLeft <= 3`, a pulsing red "Limited Spots" badge appears.

- [ ] **Step 4: Commit**

```bash
git add src/components/Blogs/PackageCard.jsx
git commit -m "feat(ui): add Book Now hover CTA, pulsing Limited Spots badge, glass price chip to PackageCard"
```

---
---

## Task 4: BlogCard — gold glass, top-accent line, refined author & footer

**Files:**
- Modify: `src/components/Blogs/BlogCard.jsx`

**Interfaces:**
- Consumes: `<Card variant glow>` (Task 2), `.top-accent`, `shadow-glow-gold` (Task 1)
- Produces: no new interfaces.

- [ ] **Step 1: Rewrite `src/components/Blogs/BlogCard.jsx`**

Replace the entire file:

```jsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "../UI/Card";
import Badge from "../UI/Badge";

const BlogCard = ({ image, date, title, content, author, category }) => {
  return (
    <Link
      to={`/blogs/${title}`}
      onClick={() => window.scrollTo(0, 0)}
      state={{ image, date, title, content, author, category }}
      className="group block h-full"
    >
      <Card
        variant="light"
        glow="gold"
        className="relative flex flex-col h-full border-none overflow-hidden rounded-[40px] shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500"
      >
        <div className="top-accent z-10" />

        <div className="relative h-48 md:h-72 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-6 left-6">
            <Badge
              variant="secondary"
              className="backdrop-blur-md bg-white/20 text-white border-white/20 px-4 py-1.5 text-[10px] uppercase font-black tracking-widest"
            >
              {category}
            </Badge>
          </div>

          <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <span className="relative text-white font-black text-[10px] uppercase tracking-[0.3em]">
              Read Story
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary" />
            </span>
          </div>
        </div>

        <div className="p-4 md:p-10 flex-1 flex flex-col relative bg-white/60">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xs ring-2 ring-secondary/40">
              {author?.[0] || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none mb-1">
                {author}
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          <h3 className="text-sm md:text-2xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tighter font-heading leading-tight mb-2 md:mb-6">
            {title}
          </h3>

          <p className="hidden md:line-clamp-3 text-gray-500 text-sm font-medium leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
            {content?.replace(/[#*]/g, '').slice(0, 150)}...
          </p>

          <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.2em]">
              Explore <span>→</span>
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-100 group-hover:bg-secondary transition-colors delay-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-100 group-hover:bg-secondary transition-colors delay-100" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-100 group-hover:bg-secondary transition-colors delay-150" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
```

- [ ] **Step 2: Build & lint**

Run: `npm run build`
Expected: PASS.

Run: `npx eslint src/components/Blogs/BlogCard.jsx --max-warnings 0`
Expected: PASS.

- [ ] **Step 3: Manual check on running preview**

Visit home (`Recent Stories`) or `/blogs`: card has gold top-accent line, gradient avatar ring, gold glow on hover, "Read Story" with gradient underline, dots tint gold on hover.

- [ ] **Step 4: Commit**

```bash
git add src/components/Blogs/BlogCard.jsx
git commit -m "feat(ui): gold glass BlogCard with top-accent line and refined hover states"
```

---
---

## Task 5: PlaceCard + Destinations inline cards — View Journey CTA & glow

**Files:**
- Modify: `src/components/Places/PlaceCard.jsx`
- Modify: `src/pages/Destinations.jsx`

**Interfaces:**
- Consumes: `<Card variant glow>` (Task 2), `shadow-glow-primary` (Task 1)
- Produces: no new interfaces.

- [ ] **Step 1: Rewrite `src/components/Places/PlaceCard.jsx`**

Replace the entire file:

```jsx
import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import Card from "../UI/Card";
import Badge from "../UI/Badge";

const PlaceCard = ({ img, location, title }) => {
  return (
    <Card
      variant="image"
      glow="primary"
      className="h-[250px] md:h-[400px] group relative overflow-hidden rounded-[40px] cursor-pointer"
    >
      <img
        src={img}
        alt={location}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute top-4 left-4">
        <Badge
          variant="primary"
          className="bg-white/20 backdrop-blur-md text-white border-white/30"
        >
          Featured
        </Badge>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-2 text-primary mb-2">
          <IoLocationSharp className="text-lg" />
          <span className="text-xs font-black uppercase tracking-widest">
            {location}
          </span>
        </div>
        <h3 className="text-2xl font-black text-white leading-tight group-hover:text-primary transition-colors relative w-fit">
          {title || "Explore Destination"}
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 origin-left bg-gradient-to-r from-primary to-secondary transition-transform duration-500" />
        </h3>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <span className="inline-flex items-center justify-center gap-2 w-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-full">
          View Journey →
        </span>
      </div>
    </Card>
  );
};

export default PlaceCard;
```

- [ ] **Step 2: Rewrite the destination cards in `src/pages/Destinations.jsx`**

Replace the `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">...` block (lines 33-46) with:

```jsx
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((d) => (
              <Link key={d._id} to={`/destinations/${d.slug}`} className="group block">
                <div className="relative h-80 overflow-hidden rounded-[40px] shadow-xl card-lift hover:shadow-glow-primary transition-shadow duration-500 group-hover:-translate-y-2">
                  <img src={d.heroImage} alt={d.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors relative w-fit">
                      {d.name}
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 origin-left bg-gradient-to-r from-primary to-secondary transition-transform duration-500" />
                    </h3>
                    <p className="text-gray-300 text-sm font-medium line-clamp-2">{d.shortIntro}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-flex items-center justify-center gap-2 w-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-full">
                      Explore Destination →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
```

- [ ] **Step 3: Build & lint**

Run: `npm run build`
Expected: PASS.

Run: `npx eslint src/components/Places/PlaceCard.jsx src/pages/Destinations.jsx --max-warnings 0`
Expected: PASS.

- [ ] **Step 4: Manual check on running preview**

Home gallery + `/destinations`: hover shows teal glow, gradient underline on title, "View Journey"/"Explore Destination" pill slides up.

- [ ] **Step 5: Commit**

```bash
git add src/components/Places/PlaceCard.jsx src/pages/Destinations.jsx
git commit -m "feat(ui): add View Journey hover CTA and glow to PlaceCard and destination cards"
```

---
---

## Task 6: Trending + Banner — dark glass, gold glow, pulsing badge, glass stat card

**Files:**
- Modify: `src/components/Home/Trending.jsx`
- Modify: `src/components/Banner/Banner.jsx`

**Interfaces:**
- Consumes: `<Card variant glow>` (Task 2), `shadow-glow-gold`, `animate-pulse-soft`, `.section-wash-dark` (Task 1)
- Produces: no new interfaces.

- [ ] **Step 1: Update `src/components/Home/Trending.jsx`**

Make these edits:

1. Change the section wrapper (line 54) from `className="py-24 bg-slate-900 overflow-hidden"` to `className="py-24 section-wash-dark overflow-hidden"`.

2. Change the `<Card>` usage (lines 90-93) from:

```jsx
                  <Card
                    className="group relative h-[420px] rounded-[40px] overflow-hidden border-none shadow-2xl cursor-pointer"
                    onClick={() => handleNavigate(item)}
                  >
```

to:

```jsx
                  <Card
                    variant="image"
                    glow="gold"
                    className="group relative h-[420px] rounded-[40px] overflow-hidden border-none shadow-2xl cursor-pointer"
                    onClick={() => handleNavigate(item)}
                  >
```

3. Add the pulsing Limited Spots badge after the Group badge (after line 108 `)}`). Insert:

```jsx
                      {item.isGroupTour &&
                        item.maxCapacity - item.currentBookings <= 3 && (
                          <span className="animate-pulse-soft inline-flex items-center gap-1.5 bg-red-500/90 text-white border border-red-300/50 shadow-[0_0_18px_rgba(239,68,68,0.6)] px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest">
                            Limited Spots
                          </span>
                        )}
```

- [ ] **Step 2: Update `src/components/Banner/Banner.jsx`**

Make these edits:

1. Change section wrapper (line 29) from `className="bg-slate-900 py-24"` to `className="section-wash-dark py-24"`.

2. Replace the stat badge (lines 40-45) from:

```jsx
            <div className="absolute bottom-0 right-0 z-20 bg-secondary text-white p-5 rounded-2xl shadow-xl border border-secondary/20">
              <p className="font-black text-2xl leading-none">500+</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-1 text-white/90">
                Happy Adventurers
              </p>
            </div>
```

to:

```jsx
            <div className="absolute bottom-0 right-0 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white p-5 rounded-2xl shadow-2xl">
              <p className="font-black text-2xl leading-none text-secondary">500+</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-1 text-white/90">
                Happy Adventurers
              </p>
            </div>
```

- [ ] **Step 3: Build & lint**

Run: `npm run build`
Expected: PASS.

Run: `npx eslint src/components/Home/Trending.jsx src/components/Banner/Banner.jsx --max-warnings 0`
Expected: PASS.

- [ ] **Step 4: Manual check on running preview**

Home: Trending section has deep teal-black radial backdrop; cards glow gold on hover; group tours with `spotsLeft <= 3` show pulsing badge. Banner stat card is glass with gold number.

- [ ] **Step 5: Commit**

```bash
git add src/components/Home/Trending.jsx src/components/Banner/Banner.jsx
git commit -m "feat(ui): dark-glass Trending and Banner with gold glow and glass stat badge"
```

---
---

## Task 7: Features + Testimonial — glass content cards

**Files:**
- Modify: `src/components/Home/Features.jsx`
- Modify: `src/components/Testimonial/Testimonial.jsx`

**Interfaces:**
- Consumes: `<Card variant glow>` (Task 2), `shadow-glow-*`, `.glass-light`, `.top-accent`, `.section-wash-light` (Task 1)
- Produces: no new interfaces.

- [ ] **Step 1: Rewrite `src/components/Home/Features.jsx`**

Replace the entire file:

```jsx
import React from "react";
import { Shield, Map, Compass, Users } from "lucide-react";
import Card from "../UI/Card";

const features = [
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: "Safe & Secure",
    desc: "Your safety is our priority with certified guides and premium equipment.",
    chip: "bg-gradient-to-br from-primary to-[#0e7490] shadow-glow-primary",
  },
  {
    icon: <Map className="w-8 h-8 text-white" />,
    title: "Expert Guides",
    desc: "Local experts who know every hidden gem and secret trail.",
    chip: "bg-gradient-to-br from-secondary to-[#ca8a04] shadow-glow-gold",
  },
  {
    icon: <Compass className="w-8 h-8 text-white" />,
    title: "Customized Trips",
    desc: "Tailor-made itineraries designed specifically for your interests.",
    chip: "bg-gradient-to-br from-accent to-[#c2410c] shadow-glow-accent",
  },
  {
    icon: <Users className="w-8 h-8 text-white" />,
    title: "Small Groups",
    desc: "Intimate travel experiences with a focus on personal connection.",
    chip: "bg-gradient-to-br from-primary to-[#0e7490] shadow-glow-primary",
  },
];

const Features = () => {
  return (
    <div className="py-24 section-wash-light">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-primary font-bold uppercase tracking-widest mb-3 text-sm">
            Why Choose Us
          </p>
          <h2 className="text-4xl md:text-5xl font-black font-heading text-slate-900">
            The Makolo Difference
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <Card
              key={i}
              delay={i * 0.1}
              variant="light"
              glow="primary"
              className="p-8 text-center flex flex-col items-center border border-white/40"
            >
              <div className={`mb-6 p-5 rounded-2xl text-white ${f.chip}`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 tracking-tight">
                {f.title}
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
```

- [ ] **Step 2: Update `src/components/Testimonial/Testimonial.jsx`**

Make these edits:

1. Change section wrapper (line 27) from `className="py-24 bg-slate-200"` to `className="py-24 section-wash-light"`.

2. Replace the testimonial card div (lines 37-54) from:

```jsx
                <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 h-full relative">
                  <span className="absolute top-6 right-8 text-7xl text-primary/10 font-serif leading-none select-none">&quot;</span>
                  <div className="flex gap-1 text-secondary mb-4">
                    {Array.from({ length: rating || 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium mb-8 relative z-10">{text}</p>
                  <div className="flex items-center gap-4">
                    {image ? (
                      <img src={image} alt={name} loading="lazy" className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black ring-2 ring-primary/30">{name?.[0]}</div>
                    )}
                    <div>
                      <p className="font-black text-slate-900 text-sm">{name}</p>
                      <p className="text-primary font-bold text-xs uppercase tracking-wider">{role}</p>
                    </div>
                  </div>
                </div>
```

to:

```jsx
                <div className="glass-light rounded-3xl p-8 h-full relative card-lift hover:shadow-glow-gold transition-shadow duration-300">
                  <span className="absolute top-6 right-8 text-7xl text-primary/10 font-serif leading-none select-none">&quot;</span>
                  <span className="absolute top-0 left-8 right-8 h-1 rounded-b-full bg-gradient-to-r from-primary via-secondary to-primary" />
                  <div className="flex gap-1 text-secondary mb-4">
                    {Array.from({ length: rating || 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium mb-8 relative z-10">{text}</p>
                  <div className="flex items-center gap-4">
                    {image ? (
                      <img src={image} alt={name} loading="lazy" className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary/40" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-black ring-2 ring-secondary/40">{name?.[0]}</div>
                    )}
                    <div>
                      <p className="font-black text-slate-900 text-sm">{name}</p>
                      <p className="text-primary font-bold text-xs uppercase tracking-wider">{role}</p>
                    </div>
                  </div>
                </div>
```

- [ ] **Step 3: Build & lint**

Run: `npm run build`
Expected: PASS.

Run: `npx eslint src/components/Home/Features.jsx src/components/Testimonial/Testimonial.jsx --max-warnings 0`
Expected: PASS.

- [ ] **Step 4: Manual check on running preview**

Home: Features has ivory radial backdrop, gradient glowing icon chips, glass cards. Testimonials: glass cards, gold gradient top line, gold stars, gradient avatar ring.

- [ ] **Step 5: Commit**

```bash
git add src/components/Home/Features.jsx src/components/Testimonial/Testimonial.jsx
git commit -m "feat(ui): glass Features and Testimonial cards with gradient accents"
```

---
---

## Task 8: Blogs/Places/Packages sections — washes, glass FilterSidebar & no-results

**Files:**
- Modify: `src/components/Blogs/BlogsComp.jsx`
- Modify: `src/components/Places/Places.jsx`
- Modify: `src/components/Blogs/PackagesComp.jsx`
- Modify: `src/components/Blogs/FilterSidebar.jsx`

**Interfaces:**
- Consumes: `.section-wash-light`, `.glass-light`, `hover:shadow-glow-primary` (Task 1)
- Produces: no new interfaces.

- [ ] **Step 1: Update section backdrops**

In `src/components/Blogs/BlogsComp.jsx` line 21, change `bg-slate-100` to `section-wash-light`:

```jsx
    <div className="section-wash-light py-24">
```

In `src/components/Places/Places.jsx` line 21, change `bg-stone-300` to `section-wash-light`:

```jsx
    <div className="section-wash-light py-24">
```

In `src/components/Blogs/PackagesComp.jsx` line 77, change `bg-gray-50` to `section-wash-light`:

```jsx
    <div className="section-wash-light min-h-screen">
```

- [ ] **Step 2: Glass the no-results card in `PackagesComp.jsx`**

Replace line 120 `className="col-span-full py-32 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm"` with:

```jsx
                  <div className="col-span-full py-32 text-center glass-light rounded-3xl border border-dashed border-white/60">
```

- [ ] **Step 3: Glass the `FilterSidebar.jsx` container**

Replace line 26 `className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-8 sticky top-24 h-fit"` with:

```jsx
    <div className="glass-light p-6 rounded-2xl flex flex-col gap-8 sticky top-24 h-fit card-lift hover:shadow-glow-primary transition-shadow duration-300">
```

- [ ] **Step 4: Build & lint**

Run: `npm run build`
Expected: PASS.

Run: `npx eslint src/components/Blogs/BlogsComp.jsx src/components/Places/Places.jsx src/components/Blogs/PackagesComp.jsx src/components/Blogs/FilterSidebar.jsx --max-warnings 0`
Expected: PASS.

- [ ] **Step 5: Manual check on running preview**

`/packages`: sidebar is glass with teal glow on hover; no-results state is glass. Home blog + gallery sections have ivory radial wash.

- [ ] **Step 6: Commit**

```bash
git add src/components/Blogs/BlogsComp.jsx src/components/Places/Places.jsx src/components/Blogs/PackagesComp.jsx src/components/Blogs/FilterSidebar.jsx
git commit -m "feat(ui): section washes, glass FilterSidebar and no-results card"
```

---
---

## Task 9: DestinationDetail — glass sidebar cards & gallery hover

**Files:**
- Modify: `src/pages/DestinationDetail.jsx`

**Interfaces:**
- Consumes: `.glass-light`, `shadow-glow-*`, `.section-wash-light` (Task 1)
- Produces: no new interfaces.

- [ ] **Step 1: Update `src/pages/DestinationDetail.jsx`**

Make these edits:

1. Page wrapper (line 28): change `className="min-h-screen bg-gray-50"` to `className="min-h-screen section-wash-light"`.

2. "Best Time to Visit" card (line 67): change `className="bg-gray-900 text-white p-8 rounded-[32px]"` to:

```jsx
          <div className="bg-background text-white p-8 rounded-[32px] shadow-xl card-lift hover:shadow-glow-gold transition-shadow duration-300 border border-white/10">
```

3. "Wildlife Calendar" card (line 72): change `className="bg-white border p-8 rounded-[32px]"` to:

```jsx
            <div className="glass-light p-8 rounded-[32px] card-lift hover:shadow-glow-primary transition-shadow duration-300">
```

4. "Tours Here" card (line 85): change `className="bg-white border p-8 rounded-[32px]"` to:

```jsx
            <div className="glass-light p-8 rounded-[32px] card-lift hover:shadow-glow-primary transition-shadow duration-300">
```

5. Tour row (line 90): change `className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-primary/5 transition"` to:

```jsx
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl hover:bg-primary/10 transition">
```

6. Gallery tiles (line 59): change `className="w-full h-48 object-cover rounded-3xl"` to:

```jsx
                  <img key={i} src={img} alt={`${dest.name} gallery ${i + 1}`} loading="lazy" decoding="async" className="w-full h-48 object-cover rounded-3xl transition-transform duration-500 hover:scale-105 hover:shadow-glow-primary cursor-zoom-in" />
```

- [ ] **Step 2: Build & lint**

Run: `npm run build`
Expected: PASS.

Run: `npx eslint src/pages/DestinationDetail.jsx --max-warnings 0`
Expected: PASS.

- [ ] **Step 3: Manual check on running preview**

Open a destination: sidebar cards are glass with glow, gallery tiles zoom + glow on hover.

- [ ] **Step 4: Commit**

```bash
git add src/pages/DestinationDetail.jsx
git commit -m "feat(ui): glass sidebar cards and gallery hover in DestinationDetail"
```

---
---

## Task 10: About + TailorMade — glass panels, gradient borders, lucide icons

**Files:**
- Modify: `src/pages/About.jsx`
- Modify: `src/pages/TailorMade.jsx`

**Interfaces:**
- Consumes: `.glass-light`, `.gradient-border`, `.top-accent`, `shadow-glow-*` (Task 1)
- Produces: no new interfaces.

- [ ] **Step 1: Update `src/pages/About.jsx`**

Make these edits:

1. Import lucide icons at the top (after line 2 `import Badge ...`), insert:

```jsx
import { MapPin, Mail } from "lucide-react";
```

2. Visionaries panel (line 94): change `className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 shadow-sm"` to:

```jsx
            <div className="glass-light p-10 rounded-[40px] card-lift hover:shadow-glow-gold transition-shadow duration-300">
```

3. Location icon chip (lines 157-159): change

```jsx
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary text-xl">
                  📍
                </div>
```

to:

```jsx
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
```

4. Email icon chip (lines 170-172): change

```jsx
                <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary text-xl">
                  📧
                </div>
```

to:

```jsx
                <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary">
                  <Mail className="w-6 h-6" />
                </div>
```

5. Map card (line 143): change `className="rounded-[40px] overflow-hidden shadow-2xl border-none"` to:

```jsx
          <Card className="gradient-border rounded-[40px] overflow-hidden shadow-2xl border-none">
```

- [ ] **Step 2: Update `src/pages/TailorMade.jsx`**

Make these edits:

1. Page wrapper (line 69): change `className="min-h-screen pt-24 pb-12 bg-gray-50"` to `className="min-h-screen pt-24 pb-12 section-wash-light"`.

2. Form card (line 71): change `className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100"` to:

```jsx
        <div className="max-w-4xl mx-auto glass-light gradient-border rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/40">
```

3. Sidebar (line 73): change `className="md:w-1/3 bg-primary p-10 text-white flex flex-col justify-between"` to:

```jsx
          <div className="md:w-1/3 bg-gradient-to-br from-primary to-[#0e7490] p-10 text-white flex flex-col justify-between">
```

- [ ] **Step 3: Build & lint**

Run: `npm run build`
Expected: PASS.

Run: `npx eslint src/pages/About.jsx src/pages/TailorMade.jsx --max-warnings 0`
Expected: PASS.

- [ ] **Step 4: Manual check on running preview**

`/about`: visionaries panel is glass with gold glow; map card has gradient border ring; contact icons use lucide (MapPin, Mail). `/tailor-made`: form card glass with gradient border; sidebar is teal gradient.

- [ ] **Step 5: Commit**

```bash
git add src/pages/About.jsx src/pages/TailorMade.jsx
git commit -m "feat(ui): glass About and TailorMade panels with gradient borders and lucide icons"
```

---
---

## Task 11: Page hero headers — glass badges

**Files:**
- Modify: `src/pages/PackagesPage.jsx`
- Modify: `src/pages/Blogs.jsx`
- Modify: `src/pages/About.jsx` (header badge only)
- Modify: `src/pages/Destinations.jsx` (header badge only)

**Interfaces:**
- Consumes: `backdrop-blur-md`, `bg-white/20` utilities (already in project)
- Produces: no new interfaces.

- [ ] **Step 1: Glass the header badges**

In `src/pages/PackagesPage.jsx` line 13: change

```jsx
          <Badge variant="secondary" className="mb-4">
```

to

```jsx
          <Badge variant="secondary" className="mb-4 backdrop-blur-md bg-white/20 text-white border-white/30">
```

In `src/pages/Blogs.jsx` line 13: change

```jsx
          <Badge variant="primary" className="mb-4">
```

to

```jsx
          <Badge variant="primary" className="mb-4 backdrop-blur-md bg-white/20 text-white border-white/30">
```

In `src/pages/About.jsx` line 27: change

```jsx
          <Badge variant="secondary" className="mb-4">
```

to

```jsx
          <Badge variant="secondary" className="mb-4 backdrop-blur-md bg-white/20 text-white border-white/30">
```

In `src/pages/Destinations.jsx` line 23: change

```jsx
          <Badge variant="secondary" className="mb-4">Iconic Tanzania</Badge>
```

to

```jsx
          <Badge variant="secondary" className="mb-4 backdrop-blur-md bg-white/20 text-white border-white/30">Iconic Tanzania</Badge>
```

- [ ] **Step 2: Build & lint**

Run: `npm run build`
Expected: PASS.

Run: `npx eslint src/pages/PackagesPage.jsx src/pages/Blogs.jsx src/pages/About.jsx src/pages/Destinations.jsx --max-warnings 0`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/PackagesPage.jsx src/pages/Blogs.jsx src/pages/About.jsx src/pages/Destinations.jsx
git commit -m "feat(ui): glass badges on page hero headers"
```

---
---

## Task 12: Final verification & polish pass

**Files:**
- None (verification only) — unless the checks below surface issues, then fix them inline.

**Interfaces:**
- Consumes: everything from Tasks 1-11.

- [ ] **Step 1: Full lint of all changed files**

Run:

```bash
npx eslint src/index.css tailwind.config.js src/components/UI/Card.jsx src/components/Blogs/PackageCard.jsx src/components/Blogs/BlogCard.jsx src/components/Places/PlaceCard.jsx src/components/Home/Trending.jsx src/components/Banner/Banner.jsx src/components/Home/Features.jsx src/components/Testimonial/Testimonial.jsx src/components/Blogs/BlogsComp.jsx src/components/Places/Places.jsx src/components/Blogs/PackagesComp.jsx src/components/Blogs/FilterSidebar.jsx src/pages/Destinations.jsx src/pages/DestinationDetail.jsx src/pages/About.jsx src/pages/TailorMade.jsx src/pages/PackagesPage.jsx src/pages/Blogs.jsx --max-warnings 0
```

Expected: PASS (0 warnings). Note: `src/index.css` is linted by eslint only for syntax; it should be ignored/harmless. If eslint errors on the CSS file, run the command without it.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Full manual sweep on the running preview**

Visit, at desktop (1440px) and mobile (375px):
- Home: Hero unchanged, Features glass + icon chips, Trending dark glass + gold glow, Blogs glass cards, Gallery View Journey CTAs, Banner glass stat, Testimonials glass.
- `/packages`: glass sidebar, Book Now pills, pulsing badges, glass no-results.
- `/blogs`, `/destinations`, `/destinations/:slug`, `/about`, `/tailor-made`.
- Verify `prefers-reduced-motion` via devtools emulation: pulse badge stops pulsing, hover lift disabled.
- Verify all links still navigate and no layout overflow.

- [ ] **Step 4: Commit any fixups**

If any issues were found and fixed, commit them; otherwise nothing to commit.

```bash
git add -A
git commit -m "chore(ui): final polish pass for card redesign"
```

- [ ] **Step 5: Update SDD ledger (if using subagent-driven development)**

Record all task completions and any logged minors in `.superpowers/sdd/progress.md`.

---
---

## Self-Review Notes (run by planner)

- **Spec coverage:** Section 1 (tokens) → Task 1. Section 2 (Card primitive) → Task 2. Section 3 (PackageCard/BlogCard/PlaceCard/Trending/Features/Testimonial/Banner) → Tasks 3-7. Section 4 (backdrops, PackagesComp, FilterSidebar, Destinations, DestinationDetail, About, TailorMade, headers) → Tasks 5, 6, 7, 8, 9, 10, 11.
- **Placeholder scan:** every step has concrete code or exact edit instructions; no TBD/TODO.
- **Type consistency:** `Card` props `variant`/`glow`/`lift`/`delay`/`className` defined in Task 2 and used identically in Tasks 3-7. `glow` values limited to `primary|gold|accent|none`. Tailwind class names from Task 1 (`shadow-glow-*`, `animate-pulse-soft`, `.glass-light`, `.glass-dark`, `.gradient-border`, `.top-accent`, `.card-lift`, `.section-wash-*`) match their usage in later tasks.
