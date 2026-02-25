# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal bilingual portfolio site. Single-page two-column layout. See `PRD.md` for full requirements.

## Tech Stack

- **Framework:** Astro (SSG) + TypeScript, scaffolded via `pnpm create astro@latest`
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite` plugin), dark mode via `class="dark"` on `<html>`
- **Content:** MDX for projects; JSON for resume data
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
- **Right column** (scrollable): About, Experience, Projects sections stacked vertically
- **Scroll-spy**: Intersection Observer highlights the active nav link as the user scrolls
- Below `lg` breakpoint: columns stack into a single-column mobile layout

### Key layouts and components

- `src/layouts/MainLayout.astro` — two-column shell for the single-page index, includes scroll-spy + theme toggle scripts
- `src/components/LeftColumn.astro` — sticky left column (nav, lang switch, theme toggle, social links)
- `src/components/ExperienceEntry.astro` — single experience card
- `src/components/ProjectCard.astro` — single project card with optional thumbnail and external URL

### i18n (two-locale routing)

- English at `/`, Traditional Chinese at `/zh/`
- Single-page index: `src/pages/index.astro` (en) and `src/pages/zh/index.astro` (zh-TW)
- UI strings in `src/i18n/en.ts` and `src/i18n/zh-TW.ts` with a `t(key, lang)` helper
- Layouts accept a `lang` prop; every page sets `<html lang>`, `hreflang` alternates, and canonical URL

### Content model

- **Projects** (`src/content/projects/`): MDX with frontmatter — `title`, `summary`, `role`, `tags`, `stack`, `outcomes`, `featured`, `lang`, `urlSlug`, `url` (optional), `thumbnail` (optional), `sortOrder`
- **Resume** (`src/data/resume.en.json`, `src/data/resume.zh-TW.json`): structured JSON driving the experience section — `experience[]` (company, title, dates, description, skills[])

### Theme system

- Inline `<head>` script reads `localStorage.theme`, falls back to `prefers-color-scheme`, toggles `class="dark"` on `<html>` — no FOUC
- Toggle button in left column updates class + localStorage with accessible `aria` label

### Key conventions

- **Keep it simple.** Prefer flat, obvious code over abstractions. Fewer files, fewer layers.
- Minimal client-side JS — only scroll-spy observer + theme toggle; use Astro islands only when interactive behavior is required
- Static-first: no server runtime, pure SSG output
- Resume PDF files live in `public/`
- About section uses `set:html` to allow HTML (links, bold) in i18n strings
- Content files use `{name}-en.mdx` / `{name}-zh.mdx` naming to avoid ID collisions in the content store
- `urlSlug` instead of `slug` in frontmatter because `slug` is reserved by Astro's glob content loader

## Implementation Notes

- **Tailwind v4:** CSS-first configuration — no `tailwind.config.js`. Use `@import "tailwindcss"` in a CSS file and configure via `@theme` directives.
- **Dark mode variant** is declared in `global.css` as `@variant dark (&:where(.dark, .dark *));` — use `dark:` prefix in classes as usual.
- **Color palette:** slate grays + teal accent, defined as `@theme` tokens in `global.css`. Stay consistent with these.
- **i18n type safety:** `en.ts` exports `TranslationKey` (derived from its keys). All translation keys must be added to `en.ts` first — `zh-TW.ts` must match the same keys.
- **Content collections use `glob()` loader** (Astro 5 pattern) in `src/content.config.ts`, not the legacy file-based collections.
- **No linter, formatter, or test runner** is configured. `pnpm build` is the only validation command.
- **Deployment:** pushing to `main` triggers GitHub Actions → `pnpm build` → rsync `dist/` to VPS. CI uses Node 24 / pnpm 9.
