# Ahmed Naik — Portfolio

A personal portfolio site for a UX/UI designer. Standalone, standard **Next.js** — ready to build and deploy anywhere (Vercel, Netlify, a Node host, or a static/edge platform).

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — entrance and scroll animations
- **Lenis** — smooth scrolling
- Custom cursor that auto-inverts over dark backgrounds

## Routes

| Route                 | Page                                                         |
| --------------------- | ----------------------------------------------------------- |
| `/`                   | Landing — hero, selected projects, about, contact           |
| `/about`              | Full about page — experience, skills, education, philosophy |
| `/projects/[slug]`    | Project case-study detail (statically generated per project)|

Project content lives in [`lib/projects.ts`](lib/projects.ts) — edit that one file to add, remove, or update case studies. Only LocalBitcoins and ListoBite ship with real imagery; the rest fall back gracefully to an accent-colour card with the project title.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build & deploy

```bash
npm run build   # production build
npm run start   # serve the production build locally
```

**Vercel (recommended):** push this folder to a Git repo and import it at [vercel.com/new](https://vercel.com/new). No configuration or environment variables are required — it builds out of the box.

## Customising

- **Content / copy:** project data in `lib/projects.ts`; about-page data (experience, education, skills) at the top of `app/about/page.tsx`.
- **Photo:** replace `public/portrait.jpg`.
- **Project images:** drop files in `public/projects/` and reference them from `lib/projects.ts`.
- **Accent colour:** the blue `#3631F5` is defined as an `ACCENT` constant near the top of each `components/v2/*` file.
- **Contact email & socials:** `components/v2/V2Contact.tsx`.

## Project structure

```
app/
  layout.tsx              Root layout — fonts, smooth scroll, cursor
  page.tsx                Landing page
  globals.css             Global styles + Tailwind
  about/page.tsx          About page
  projects/[slug]/        Project detail (page + client component)
components/
  v2/                     Landing + shared sections (nav, hero, projects, about, contact)
  ui/Cursor.tsx           Custom cursor
  layout/                 Smooth-scroll provider
lib/
  projects.ts             Project data + types
  colorUtils.ts           Contrast / colour helpers
public/                   Images and static assets
```
