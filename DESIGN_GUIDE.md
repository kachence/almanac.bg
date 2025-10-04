# Almanac.bg – Design System

A warm, human calendar experience that feels inviting rather than sterile. Built around the **Ember & Saffron** color palette—warm autumn tones that differentiate us from the sea of blue/gray calendars.

## Core Principles

- **Warm over cold** – Ember orange, saffron yellow, warm neutrals. No cold blues/grays.
- **Human over corporate** – Friendly, approachable, personal. Calendars should feel helpful, not clinical.
- **Clarity over decoration** – Information first, but presented beautifully.
- **Fast answers** – "What's today?" answered in 3 seconds; deep-dives available for those who want them.
- **Accessible by default** – WCAG AA contrast, proper focus states, readable sizes.

## Color Palette (Ember & Saffron)

Use Tailwind color aliases that map to CSS variables; never hardcode hex.

### Brand Colors

- **Primary (Ember):** `bg-primary` (#F46A03) / `hover:bg-primary-hover` (#DD5F02) / `active:bg-primary-pressed` (#C95502)
- **Accent (Saffron):** `bg-accent` (#F4BF3A) – used for highlights, today indicators, focus rings
- **Critical (Carmine):** `bg-critical` (#CC2B2B) – holidays, non-working days, urgent badges
- **Support (Beeswax):** `bg-soft` (#E9DEB8) – soft fills, subtle backgrounds (use at 60% opacity: `bg-soft/60`)
- **Ink-Navy (rare use):** `text-ink-rare` (#0C3042) – ≤5% usage, only for extreme contrast needs

### Surfaces

- **Background:** `bg-bg` (#FFFAF2 light / #18120E dark)
- **Alt Background:** `bg-bg-alt` (#FFF6EB / #1A1410)
- **Cards:** `bg-card` (#FEF1E1 / #261D17)
- **Panels:** `bg-panel` (#FFF6EB / #201813)
- **Borders:** `border-border` (#F2E6D7 / #3A2E26)

### Text

- **Primary:** `text-text` (#1F1915 / #F4EEE8)
- **Muted:** `text-muted` (#7A6B5E / #C9BFB6) – warmer earthier tone
- **Muted Strong:** `text-muted-strong` (#6B5E55 / #D4CAC1)

### Semantic Colors

- **Info:** `bg-info` (#D39A17) with `bg-info-bg` tint
- **Warning:** `bg-warning` (#B5560A) with `bg-warning-bg` tint
- **Success:** `bg-success` (#8C6E1A) with `bg-success-bg` tint

**Note:** Success is olive-amber, not green. Fits the warm palette.

## Layout & Spacing

### Containers

```html
<!-- Page container -->
<div class="max-w-7xl mx-auto px-4">

<!-- Hero sections (wider) -->
<div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
```

### Section Spacing

- Hero sections: `py-12 px-4`
- Content sections: `py-12 px-4` or `py-16 px-4`
- Tight sections: `py-6 px-4` or `py-8 px-4`

### Grid Patterns

- **Hero (Today + Upcoming):** `grid lg:grid-cols-2 gap-8 lg:items-stretch`
- **Content + Sidebar:** `grid lg:grid-cols-[1fr,360px] gap-8`
- **Card grids:** `grid md:grid-cols-2 lg:grid-cols-3 gap-6`

### Radii

- **Cards:** `rounded-2xl`
- **Buttons:** `rounded-xl`
- **Chips/badges:** `rounded-full` or `rounded-lg`
- **Small controls:** `rounded-lg`

### Shadows

Subtle, 2-layer system:

```css
shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)]
```

Use sparingly; prefer border + slight elevation on hover.

## Typography

### Font Stack

- **Body:** Inter (Google Fonts)
- **Code/Mono:** IBM Plex Mono (for calendar grids, dates)

### Hierarchy

```html
<!-- H1 (page hero) -->
<h1 class="text-4xl lg:text-5xl font-bold text-text">

<!-- H1 (massive hero) -->
<h1 class="text-5xl lg:text-6xl font-bold text-text">

<!-- H2 (section) -->
<h2 class="text-3xl font-bold text-text">

<!-- H3 (subsection) -->
<h3 class="text-2xl font-bold text-text">

<!-- Body -->
<p class="text-text">

<!-- Secondary text -->
<p class="text-muted">
<p class="text-muted-strong">
```

### Font Weights

- Regular: 400 (default)
- Medium: 500 (use sparingly)
- **Semibold: 600 (preferred for emphasis)**
- Bold: 700 (headings only)

## Components

### Cards (Main Content)

```html
<div class="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_2px_rgba(31,25,21,.08),0_8px_24px_rgba(31,25,21,.06)]">
  <h2 class="text-2xl font-bold text-text mb-6">Card Title</h2>
  <p class="text-muted">Content...</p>
</div>
```

**With accent top border (hero cards):**

```html
<div class="... border-t-[2px] border-t-accent">
```

### Buttons

**Primary CTA:**

```html
<button class="h-12 px-8 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors shadow-sm focus:outline focus:outline-3 focus:outline-accent/63 focus:outline-offset-2">
  Виж календара
</button>
```

**Secondary:**

```html
<button class="h-12 px-5 border-2 border-[#F2E6D7] text-[#C95502] bg-[#FFFBF2] hover:bg-[#FFE8D1] rounded-xl font-semibold transition-colors focus:outline focus:outline-3 focus:outline-accent/63 focus:outline-offset-2">
  Добави събития
</button>
```

**Ghost/Link button:**

```html
<button class="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors">
  Action
</button>
```

### Chips (Name Days, Categories)

**Name day chip (warm yellow):**

```html
<span class="px-3 py-1.5 bg-[#FFF0C8] text-[#1F1915] border border-[#F0C770] rounded-full text-sm font-medium">
  Денис
</span>
```

**Holiday chip (critical red):**

```html
<span class="px-2 py-0.5 bg-critical text-white rounded text-xs font-medium">
  Неработен
</span>
```

**Movable holiday badge:**

```html
<span class="px-2 py-0.5 bg-warning/20 text-warning border border-warning/40 rounded text-xs font-medium">
  ↔ Подвижен
</span>
```

**Date chip (for lists):**

```html
<div class="w-14 h-14 bg-[#FFF0C8] border border-[#F0C770] rounded-lg flex flex-col items-center justify-center leading-tight">
  <span class="text-[#C95502] font-bold text-lg">6</span>
  <span class="text-[#C95502] font-medium text-xs">окт</span>
</div>
```

### Icons

- **Use:** Lucide React icons (primary), FontAwesome (legacy/secondary)
- **Size guide:** `w-4 h-4` (small), `w-5 h-5` (medium), `w-8 h-8` (large), `w-10 h-10` (hero)
- **Color:** Prefer `text-primary`, `text-accent`, `text-muted` over raw colors

**Icon + text alignment:**

```html
<div class="flex items-center gap-2">
  <Moon class="w-4 h-4" />
  <span>Растяща луна</span>
</div>
```

### Focus States

**Standard focus ring (accent yellow, 63% opacity):**

```css
focus:outline focus:outline-3 focus:outline-[#F4BF3AA0] focus:outline-offset-2
```

Always visible, always accessible.

## Patterns

### Day Metadata Strip

```html
<div class="flex items-center gap-2 text-xs text-muted">
  <span>Работен ден</span>
  <span class="text-muted/50">•</span>
  <span>Седмица 40</span>
  <span class="text-muted/50">•</span>
  <span>Ден 276 от годината</span>
</div>
```

### Legend/Key

```html
<div class="flex items-center gap-2">
  <div class="w-3 h-3 rounded-full bg-accent" />
  <span class="text-sm text-muted">Имен ден</span>
</div>
```

### Breadcrumbs

```html
<nav class="flex items-center text-sm text-muted mb-6">
  <Link href="/" class="hover:text-text transition-colors">Начало</Link>
  <ChevronRight class="h-4 w-4 mx-2" />
  <span class="text-text font-medium">Текуща страница</span>
</nav>
```

### Month Navigator (chips)

```html
<div class="flex flex-wrap gap-2">
  <a href="#month-1" class="px-4 h-10 bg-card text-text border border-border hover:border-primary/40 rounded-lg font-medium transition-colors">
    ян
  </a>
</div>
```

### "Next/Upcoming" Cards

```html
<button class="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-panel transition-colors text-left">
  <span class="flex-shrink-0 w-14 h-14 bg-[#FFF0C8] border border-[#F0C770] rounded-lg flex flex-col items-center justify-center leading-tight">
    <span class="text-[#C95502] font-bold text-lg">6</span>
    <span class="text-[#C95502] font-medium text-xs">окт</span>
  </span>
  <span class="flex-1 min-w-0 flex flex-col">
    <span class="text-sm font-semibold text-text">Тома, Томислав</span>
    <span class="text-xs text-muted-strong">Имен ден</span>
  </span>
</button>
```

**Important:** Use `<span>` not `<div>` inside buttons (hydration/HTML validity).

## Header

```html
<header class="transition-all duration-200 border-b border-border bg-[color-mix(in_oklab,var(--bg),transparent_10%)]/70 backdrop-blur">
  <div class="max-w-8xl mx-auto px-4 h-16 flex items-center gap-3">
    <!-- Logo, nav, search, theme toggle, auth -->
  </div>
</header>
```

**Not sticky** (scrolls with page). If making sticky, add: `sticky top-0 z-50`.

## Hero Section (Today + Upcoming)

```html
<section class="py-12 px-4">
  <div class="max-w-7xl mx-auto">
    <div class="grid lg:grid-cols-2 gap-8 lg:items-stretch">
      <!-- TodayCard (left) -->
      <!-- UpcomingDates (right, hidden on mobile) -->
    </div>
  </div>
</section>
```

**Key:** Use `lg:items-stretch` + `h-full flex flex-col` on cards for equal height.

## Dark Mode

- Use the same semantic tokens (`bg-card`, `text-text`, etc.)
- Dark mode colors are automatically swapped via CSS variables
- **Do not** hardcode colors; always use tokens
- Test both themes for contrast and readability

## Accessibility

- **Focus rings:** Always visible (3px accent outline, 63% opacity)
- **Tap targets:** Minimum 44px height for buttons
- **Contrast:** All text meets WCAG AA (body 4.5:1, headings 4.5:1, critical UI 7:1)
- **Icons:** Include `aria-label` for icon-only buttons
- **Navigation:** Use semantic HTML (`<nav>`, `<section>`, `<header>`, `<footer>`)

## Do / Don't

### ✅ Do

- Use warm colors from the palette (ember, saffron, beeswax)
- Use `font-semibold` for emphasis in lists and cards
- Keep focus rings visible (63% opacity accent yellow)
- Use 2px top borders on hero cards (accent color)
- Use `bg-soft/60` for subtle background panels
- Use `<span>` instead of `<div>` inside buttons
- Use deterministic data (avoid `Math.random()` for SSR components)

### ❌ Don't

- Don't use cold blues or grays (ruins the warm palette)
- Don't use `<div>` or `<p>` inside `<button>` elements (hydration errors)
- Don't hardcode hex colors (always use Tailwind tokens)
- Don't use heavy shadows or glows (subtle is better)
- Don't make the header sticky unless requested
- Don't skip focus states (accessibility requirement)
- Don't use `Math.random()` in components that SSR (hydration mismatch)

## Performance

- Keep animations simple (0.2–0.3s transitions)
- Lazy-load heavy components below the fold
- Use Next.js Image optimization for all images
- Static generation (SSG) for calendar pages where possible
- Avoid layout shift: reserve ad/content heights

---

## File References

When building new features, reference these existing patterns:

- **Hero cards:** `src/components/TodayCard.tsx`, `src/components/UpcomingDates.tsx`
- **Navigation:** `src/components/Header.tsx`, `src/components/Footer.tsx`
- **Calendar grids:** `src/components/CalendarPreview.tsx`
- **Category pages:** `src/app/imen-den/[category]/page.tsx`
- **Year pages:** `src/app/kalendar/tsarkoven/[year]/page.tsx`
- **Color system:** `src/app/globals.css`, `tailwind.config.ts`

Copy component patterns, not just styles. Consistency > creativity.
