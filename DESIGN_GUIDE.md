# blanka.bg – Design principles and implementation notes

Keep it official‑adjacent, calm, and conversion‑focused. The UI should feel modern, trustworthy, and fast. These rules capture the landing page decisions so new features stay coherent.

## Core principles

- Clarity over decoration; prioritize scanability and contrast
- Search and key CTAs are primary; everything else is secondary
- One visual language across light and dark themes (CSS tokens)
- Subtle motion only; keep performance snappy
- Accessible by default (focus rings, readable sizes, color contrast)

## Layout and spacing

- Page container: `max-w-8xl mx-auto px-4 sm:px-6 lg:px-8`
- Section spacing: `py-14 lg:py-20` (landing hero/blocks)
- Grid gaps: default `gap-12 lg:gap-20` (hero split), cards `gap-4`
- Radii: cards/buttons `rounded-2xl`; small controls `rounded-xl`
- Shadows: very subtle; prefer border + elevation on hover

## Colors (theme tokens)

Use Tailwind color aliases that map to CSS variables; never hardcode hex.

- Surfaces: `bg-bg`, `bg-panel`, `bg-card`
- Text: `text-text`, `text-muted`
- Border: `border-border` (never `border-white`)  
  - When hiding a border for animation, use `border-transparent`, not removal
- Primary: `text-primary`, `bg-primary`, `ring-primary`  
  - Opacity utilities are supported via RGB tokens. You can use: `bg-primary/15`, `text-primary/90`, `ring-primary/35`.
- Status: `success`, `warning`, `danger` (sparingly)

Background pattern for feature sections: add both `blueprint-grid` and `noise-overlay` with reduced opacity.

```html
<section class="relative">
  <div class="relative ..."> ... </div>
</section>
```

## Typography

- Font: Inter (system fallback); base size `text-base` set to 15px
- Headings: tracking-tight; examples:  
  - H1 `text-4xl lg:text-6xl font-semibold`  
  - H2 `text-3xl lg:text-4xl font-semibold`  
- Body copy: `text-[15px] text-muted`

## Borders and surfaces

- Default border on all elevated elements: `border border-border`
- Keep a border in both states of sticky headers to avoid a flash:  
  - Not scrolled: `border-b border-transparent bg-transparent`  
  - Scrolled: `border-b border-border bg-[color-mix(in_oklab,var(--bg),transparent_10%)]/70 backdrop-blur`

## Buttons

- Primary (CTA):
```html
<button class="rounded-2xl bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50">
  Регистрирай се безплатно
</button>
```
- Ghost/secondary:
```html
<a class="rounded-2xl border border-border px-6 py-3 text-sm hover:border-primary/40">Разгледай образци</a>
```

## Inputs (search pattern)

```html
<div class="relative group">
  <!-- leading icon -->
  <svg class="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary" />
  <input class="w-full rounded-2xl bg-card border px-14 py-4 text-[15px] text-text placeholder:text-muted/70 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/35" />
</div>
```

## Cards (templates)

- Wrapper: `rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all`
- Content uses `text-text` and `text-muted`; right chevron nudges `translate-x-0.5` on hover
- Badges row: prefer `Badge` component (PDF, DOCX, version)

## Badges

- Use shadcn `Badge` with variants wired to tokens. Examples in codebase: `variant="pdf"`, `variant="docx"`, `variant="muted"`, `variant="warning"`, `variant="accent"`.

## Icons

- Use FontAwesome only (preloaded in `lib/fontawesome`).
- Accent icons: `text-primary` (not raw color)  
- "How it works" icon circles: `bg-primary/15 border-2 border-primary` with the icon `text-primary` centered.

## Motion

- Framer Motion for micro‑entrance and hover lifts
- Durations: 0.2–0.6s; `y: 20` for fade‑up; stagger small (≤0.1s)
- No parallax/heavy effects; keep 60fps

## Header

- Sticky; scrolled state adds: `border-b border-border` + subtle backdrop blur
- Search is king: desktop shows command dialog on focus; mobile routes to `/search`
- Use `max-w-8xl` for header width; make the logo/icon `text-primary`

## Hero

- Left: headline with two accent spans (primary/accent)  
- Right: 2‑column grid of template cards (6 items)
- Trust strip uses small `Badge` components (PDF/DOCX), `text-xs`

## How it works

- Three columns; each step uses a primary icon circle:  
`w-20 h-20 rounded-full bg-primary/15 border-2 border-primary grid place-items-center`

## Footer

- Top CTA block (centered): headline + paragraph + primary button
- Below: 3‑column link grid + left brand column with a short description and social icons row
- Bottom legal block: centered, two lines of muted text

## Do / Don’t

- Do: use `border-border` and CSS tokenized colors; prefer `bg-card`/`bg-panel` over hex
- Do: keep section paddings and max‑width consistent
- Don’t: use `border-white`, fixed hex colors, or large shadow glows
- Don’t: introduce new icon libraries; stick to FontAwesome

---

When in doubt, copy an existing recipe from `Header.tsx`, `Hero.tsx`, `HowItWorks.tsx`, `FeaturedTemplates.tsx`, or `Footer.tsx` and adjust content, not styling.


