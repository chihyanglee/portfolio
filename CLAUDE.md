# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal bilingual portfolio site. Single-page two-column layout. See `PRD.md` for full requirements.

## Tech Stack

- **Framework:** Astro (SSG) + TypeScript, scaffolded via `pnpm create astro@latest`
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite` plugin), dark mode via `class="dark"` on `<html>`
- **Content:** Markdown/MDX for projects and writing; JSON for resume data
- **Deployment:** Static output to VPS via GitHub Actions, served by Caddy with Docker Compose

## Build Commands

This project uses **pnpm** as its package manager.

```bash
pnpm install         # install dependencies
pnpm dev             # local dev server
pnpm build           # production build to dist/
pnpm preview         # preview production build locally
```

## Architecture

### Layout: two-column single-page

- **Left column** (`lg:sticky top-0 h-screen`): name, tagline, section nav, language/theme controls, social links
- **Right column** (scrollable): About, Experience, Projects, Writing sections stacked vertically
- **Scroll-spy**: Intersection Observer highlights the active nav link as the user scrolls
- Below `lg` breakpoint: columns stack into a single-column mobile layout
- Detail pages (`/projects/[slug]`, `/writing/[slug]`) use a separate `DetailLayout.astro`

### Key layouts and components

- `src/layouts/MainLayout.astro` — two-column shell for the single-page index
- `src/layouts/DetailLayout.astro` — layout for case study and blog post pages
- `src/components/LeftColumn.astro` — sticky left column (nav, controls, social)
- `src/components/ScrollSpy.astro` — Intersection Observer island (`client:load`)

### i18n (two-locale routing)

- English at `/`, Traditional Chinese at `/zh/`
- Single-page index: `src/pages/index.astro` (en) and `src/pages/zh/index.astro` (zh-TW)
- Detail pages: `src/pages/projects/[slug].astro`, `src/pages/zh/projects/[slug].astro`, etc.
- UI strings in `src/i18n/en.ts` and `src/i18n/zh-TW.ts` with a `t(key, lang)` helper
- Layouts accept a `lang` prop; every page sets `<html lang>`, `hreflang` alternates, and canonical URL

### Content model

- **Projects** (`src/content/projects/`): MDX with frontmatter — `title`, `summary`, `role`, `tags`, `stack`, `outcomes`, `featured`, `lang`, `slug` (slug shared across locales)
- **Writing** (`src/content/writing/`): MDX blog posts
- **Resume** (`src/data/resume.en.json`, `src/data/resume.zh-TW.json`): structured JSON driving the experience section

### Theme system

- Inline `<head>` script reads `localStorage.theme`, falls back to `prefers-color-scheme`, toggles `class="dark"` on `<html>` — no FOUC
- Toggle button in left column updates class + localStorage with accessible `aria` label

### Key conventions

- **Keep it simple.** Prefer flat, obvious code over abstractions. Fewer files, fewer layers.
- Minimal client-side JS — only scroll-spy observer + theme toggle; use Astro islands only when interactive behavior is required
- Static-first: no server runtime, pure SSG output
- Resume PDF files live in `public/`

## Implementation Notes

- **Build order:** Index page (two-column + scroll-spy) first. Detail pages (project case studies, blog posts) come later.
- **Dummy content:** Use realistic placeholder text for resume JSON, sample projects, and about section until real content is supplied.
- **Tailwind v4:** CSS-first configuration — no `tailwind.config.js`. Use `@import "tailwindcss"` in a CSS file and configure via `@theme` directives.
