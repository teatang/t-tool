# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm run start

# Run linter
npm run lint
```

## Architecture

This is a Next.js 16 application using the App Router architecture.

### Directory Structure
- `app/` - Next.js App Router pages and layouts (file-based routing)
  - `page.tsx` - Route components (e.g., `app/page.tsx` = `/`)
  - `layout.tsx` - Root layout wrapping all pages
  - `globals.css` - Global styles with Tailwind CSS v4

### Key Configuration Files
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint configuration using `eslint-config-next`
- `tsconfig.json` - TypeScript configuration with `@/*` path alias
- `app/globals.css` - Tailwind CSS v4 with `@import "tailwindcss"` and CSS variables for theming

### Styling
This project uses Tailwind CSS v4 with CSS-first configuration. Dark mode is supported via `prefers-color-scheme` media query.

### TypeScript
Strict mode is enabled. The project uses the Next.js TypeScript plugin for improved type checking in `.ts` and `.tsx` files.

## Dependencies

- **next: 16.1.4** - React framework
- **react/react-dom: 19.2.3** - UI library
- **typescript: 5** - Type safety
- **tailwindcss: ^4** - CSS framework
