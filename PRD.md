# Portfolio Site Plan (Astro, static-first)

## Goals

- Ship a fast, SEO-safe portfolio that looks credible to:
  - Engineering hiring managers / senior engineers
  - Recruiters / HR
  - Product/strategy stakeholders
- Minimal maintenance, minimal security surface
- Easy to update content (resume + projects)
- Bilingual i18n (basic): EN + zh-TW
- Light/Dark mode toggle with persistence

---

## Tech Stack

### Core

- Astro (SSG) + TypeScript, scaffolded via `pnpm create astro@latest`
- `@astrojs/mdx` integration for MDX content
- Content:
  - MDX for project case studies
  - JSON for resume data
- Package manager: **pnpm**

### UI

- Tailwind CSS v4 (`@tailwindcss/vite` plugin, CSS-first config — no `tailwind.config.js`)
- Light/Dark theme toggle using:
  - `prefers-color-scheme` default
  - persisted override in `localStorage`
  - applied via `class="dark"` on `<html>`

### i18n (Basic)

- Two-locale routing with separate paths:
  - English: `/`
  - zh-TW: `/zh/`
- Language switcher in left column that preserves current page/section
- SEO:
  - canonical + `hreflang` tags (en / zh-Hant-TW)

### Hosting / Deployment (VPS)

- Caddy (recommended) for:
  - Automatic HTTPS (Let's Encrypt)
  - Static file hosting (or reverse proxy to a small container)
- Docker Compose for:
  - predictable deployment
  - easy rollback
- CI/CD:
  - GitHub Actions builds and ships the static output (two options):
    1. Build inside Docker image and run container
    2. Build in CI and rsync the `/dist` to VPS (simpler, fewer moving parts)

---

## Layout: Two-Column Single-Page

The main portfolio is a **single page** with a sticky left column and a scrollable right column.

### Left Column (sticky, `position: sticky; top: 0; height: 100vh`)

- **Name** (large heading)
- **Title / tagline** (1 line, e.g. "Senior Software Engineer")
- **Brief description** (1–2 sentences of positioning)
- **Section nav** — anchor links to `#about`, `#experience`, `#projects`
  - Active link highlighted based on scroll position (scroll-spy)
  - Each nav item has a short horizontal indicator line that expands when active
- **Controls** — Language switch (EN / 中文) + Theme toggle (light/dark)
- **Social links** — GitHub, LinkedIn, Email (icon row, pinned to bottom of column)

### Right Column (scrollable)

All content flows vertically in a single scrollable column. Sections use `id` attributes for anchor targeting.

1. **About** (`#about`)
   - 2–3 short paragraphs: who you are, what you do, what you care about
   - No heading needed — implied by nav highlight

2. **Experience** (`#experience`)
   - Rendered from `resume.json`
   - Each entry: date range (left) + company, title, description, skill tags (right)
   - Hover/focus on an entry subtly highlights it
   - "View Full Résumé" link at the bottom → PDF download (locale-aware)

3. **Projects** (`#projects`)
   - Featured projects (3–5 cards)
   - Each card: thumbnail image (optional), title, summary, tech stack tags
   - Cards optionally link to external URL
   - "View Full Project Archive" link at the bottom (optional, links to a simple list page)

### Footer

- Minimal: short credit line (e.g. "Built with Astro & Tailwind CSS")
- Placed at bottom of right column after last section

### Responsive / Mobile

- Below `lg` breakpoint: columns stack vertically
- Left column becomes a compact header (name, tagline, hamburger or inline nav)
- Nav switches to a top sticky bar or collapsible menu
- All sections flow in a single column

---

## Scroll-Spy Navigation

The left column nav highlights the currently visible section as the user scrolls the right column.

### Implementation

- Inline `<script is:inline>` in `MainLayout.astro` (no Astro island — plain JS is simpler)
- **Intersection Observer API** observes each section (`#about`, `#experience`, `#projects`)
- On intersect, sets `data-active` attribute on the corresponding nav link; CSS handles styling via `[data-active]`
- Active state styling: nav text brightens + indicator line widens (CSS transition via `group-[[data-active]]`)
- Nav click calls `scrollIntoView({ behavior: 'smooth' })` and updates `history.pushState`

---

## Information Architecture

### Single-Page Sections (on `/` and `/zh/`)

| Section      | Content source                     |
| ------------ | ---------------------------------- |
| About        | `src/i18n/{lang}.ts` strings       |
| Experience   | `src/data/resume.{lang}.json`      |
| Projects     | `src/content/projects/*.mdx` (featured) |

---

## URL & Locale Strategy

### Locale paths

- English (default): `/`
- zh-TW: `/zh/`

### Section anchors (same page)

- `/#about`, `/#experience`, `/#projects`
- `/zh/#about`, `/zh/#experience`, `/zh/#projects`

### Locale switch behavior

- On main page: switch locale, preserve current section hash

---

## Content Model (Data-driven)

### `src/content/`

- `projects/` (Markdown/MDX)

Frontmatter fields (projects):

- `title`
- `summary`
- `role` (PM, SWE, Lead)
- `tags`
- `stack`
- `outcomes` (array)
- `featured` (boolean)
- `lang` (en | zh-TW)
- `urlSlug` (shared across languages — named `urlSlug` instead of `slug` because `slug` is reserved by Astro's glob content loader as the entry ID)
- `url` (optional, external link)
- `thumbnail` (optional, path to image)
- `sortOrder` (number, controls display order)

Content files use `{name}-en.mdx` / `{name}-zh.mdx` naming to avoid ID collisions in the content store. Schema defined in `src/content.config.ts` using Zod + `glob()` loader.

### `src/data/resume.en.json` and `src/data/resume.zh-TW.json`

- `experience[]` (company, title, dates, description, skills[])

Goal: update one JSON file and the experience section updates automatically.

---

## Light/Dark Theme Plan

### Requirements

- Default follows system preference
- User can toggle via UI (icon in left column)
- Persist preference
- No flash of wrong theme (FOUC mitigation)

### Implementation

- Inline `<script is:inline>` in `<head>` of `MainLayout.astro` (runs before paint):
  - reads `localStorage.getItem("theme")`
  - falls back to `window.matchMedia("(prefers-color-scheme: dark)")`
  - adds/removes `class="dark"` on `<html>`
- Toggle button in `LeftColumn.astro` (sun/moon SVG icons, toggled via `hidden dark:block` / `block dark:hidden`):
  - click handler in a separate `<script is:inline>` at end of `MainLayout.astro`
  - toggles `.dark` class + persists to `localStorage`
  - accessible `aria-label`

---

## i18n Plan (Astro)

### Approach

- Two index pages sharing the same layout:
  - `src/pages/index.astro` (en)
  - `src/pages/zh/index.astro` (zh-TW)
- Shared layout components accept `lang` prop
- Copy/strings:
  - `src/i18n/en.ts`
  - `src/i18n/zh-TW.ts`
  - Simple `t(key, lang)` helper

### SEO additions

- For each page:
  - set `<html lang="en">` or `<html lang="zh-Hant-TW">`
  - `link rel="alternate" hreflang="..."` for the counterpart locale
  - canonical URL per locale path

---

## Design System

### Two-column grid

- Container: `max-w-6xl mx-auto`, padding on sides
- Left column: `lg:w-1/2 lg:sticky lg:top-0 lg:h-screen` — flex column with content at top and social icons at bottom
- Right column: `lg:w-1/2` — natural document flow, sections separated by generous vertical spacing
- Below `lg`: single column stacked layout

### Typography

- Clean sans-serif font stack (Inter or system)
- Name: large bold heading
- Section content: readable body size (~16–18px)
- Muted secondary text for dates, descriptions

### Interactive details

- Experience entries and project cards have subtle hover highlight (background opacity shift)
- Nav indicator lines animate width on active state change (CSS transition)
- Smooth scroll on nav click
- Links have underline-on-hover or color shift

### Performance

- Compress images
- Minimal client JS: only scroll-spy observer + theme toggle
- Astro islands only for interactive components

---

## Project Structure

```
src/
├── pages/
│   ├── index.astro                  # single-page layout (en)
│   └── zh/
│       └── index.astro              # single-page layout (zh-TW)
├── layouts/
│   └── MainLayout.astro             # two-column shell + scroll-spy + theme toggle scripts
├── components/
│   ├── LeftColumn.astro             # sticky sidebar: name, tagline, nav, lang switch, theme toggle, social links
│   ├── ExperienceEntry.astro        # single experience card
│   └── ProjectCard.astro            # single project card (optional thumbnail + external URL)
├── content/
│   └── projects/                    # MDX project case studies ({name}-en.mdx, {name}-zh.mdx)
├── content.config.ts                # Astro content collection schemas (Zod + glob loader)
├── data/
│   ├── resume.en.json               # English resume data
│   └── resume.zh-TW.json            # Chinese resume data
├── i18n/
│   ├── en.ts                        # English UI strings
│   ├── zh-TW.ts                     # Chinese UI strings
│   └── index.ts                     # t(key, lang) helper + utilities
└── styles/
    └── global.css                   # Tailwind v4 imports + @theme tokens + dark mode variant
```

### Implementation notes vs. original plan

- **No separate components for ThemeToggle, LanguageSwitch, SectionNav, or ScrollSpy** — these are inlined into `LeftColumn.astro` and `MainLayout.astro` for simplicity (fewer files, fewer layers)
- **Scroll-spy uses inline `<script is:inline>`** in `MainLayout.astro` instead of an Astro island
- **About section uses `set:html`** to allow HTML (links, bold) in i18n strings

---

## Acceptance Checklist

- Single-page layout with sticky left column and scrollable right column
- Scroll-spy navigation highlights active section
- Smooth scroll on nav link click
- Light/Dark theme toggle works and persists (no FOUC)
- English + zh-TW versions accessible and consistent
- Resume experience section renders from JSON; PDF downloadable
- Responsive: stacks to single column on mobile
- Clean URLs, canonical + hreflang present
- Pages load fast (Lighthouse good)
- HTTPS enabled on VPS
