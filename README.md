# Portfolio

Personal bilingual portfolio site — single-page two-column layout built with Astro and Tailwind CSS.

## Tech Stack

- **Astro** (SSG) + TypeScript
- **Tailwind CSS v4** (CSS-first config, `@tailwindcss/vite` plugin)
- **Content:** MDX for projects and writing, JSON for resume data
- **Deployment:** Static output to VPS via GitHub Actions, served by Caddy with Docker Compose

## Getting Started

```bash
pnpm install       # install dependencies
pnpm dev           # start dev server at localhost:4321
pnpm build         # production build to dist/
pnpm preview       # preview production build
```

## Project Structure

```
src/
├── pages/
│   ├── index.astro              # English home (/)
│   └── zh/
│       └── index.astro          # Chinese home (/zh/)
├── layouts/
│   ├── MainLayout.astro         # Two-column shell (index pages)
│   └── DetailLayout.astro       # Project/writing detail pages
├── components/
│   ├── LeftColumn.astro         # Sticky sidebar: nav, controls, social
│   ├── ExperienceEntry.astro    # Single experience card
│   ├── ProjectCard.astro        # Single project card
│   └── WritingEntry.astro       # Single writing entry
├── content/
│   ├── projects/                # MDX project case studies
│   └── writing/                 # MDX blog posts
├── data/
│   ├── resume.en.json           # English resume data
│   └── resume.zh-TW.json       # Chinese resume data
├── i18n/
│   ├── en.ts                    # English UI strings
│   ├── zh-TW.ts                 # Chinese UI strings
│   └── index.ts                 # t(key, lang) helper
└── styles/
    └── global.css               # Tailwind imports + custom theme
```

## i18n

Two-locale routing:
- English: `/`, `/projects/<slug>`, `/writing/<slug>`
- Traditional Chinese: `/zh/`, `/zh/projects/<slug>`, `/zh/writing/<slug>`

Each page sets `<html lang>`, `hreflang` alternates, and canonical URL. UI strings live in `src/i18n/`.

## Theming

Class-based dark mode (`class="dark"` on `<html>`):
- Inline `<head>` script reads `localStorage.theme`, falls back to `prefers-color-scheme` — no FOUC
- Toggle button in the sidebar updates the class and persists the preference

## Deployment

Static build output (`dist/`) deployed to a VPS:
- **Caddy** handles HTTPS (auto Let's Encrypt) and serves static files
- **Docker Compose** for predictable deployment and rollback
- **GitHub Actions** builds and ships the output
