# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server (after build)
pnpm start

# Run linter
pnpm lint

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## Architecture

This is a Next.js 16 application using the App Router architecture with internationalization (i18n) support.

### Directory Structure
- `app/` - Next.js App Router pages and layouts (file-based routing)
  - `page.tsx` - Route components (e.g., `app/page.tsx` = `/`)
  - `layout.tsx` - Root layout wrapping all pages
  - `globals.css` - Global styles with Tailwind CSS v4
  - `tools/` - Tool pages (e.g., `app/tools/regex-tester/page.tsx` = `/tools/regex-tester`)
  - `tools/games/` - Mini games (e.g., `app/tools/games/tetris/page.tsx` = `/tools/games/tetris`)
  - `[locale]/` - i18n locale routes (zh/en)

### Game Development
- Games are located in `app/tools/games/`
- Each game should have:
  - `page.tsx` - Next.js page entry
  - `GameName.tsx` - Main game component
  - `gameEngine.ts` - Game logic class for unit testing
- Unit tests go in `tests/games/` directory
- Games must support dark/light mode via the `isDark` prop

### Key Configuration Files
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint configuration using `eslint-config-next`
- `tsconfig.json` - TypeScript configuration with `@/*` path alias
- `app/globals.css` - Tailwind CSS v4 with CSS variables for theming
- `lib/store/` - Redux Toolkit store configuration

### State Management
- Redux Toolkit for global state (theme mode)
- Custom I18nContext for internationalization (zh/en)
- Theme persistence via localStorage

### Styling
- Tailwind CSS v4 with CSS-first configuration
- Ant Design v5 for UI components
- Dark mode supported via `prefers-color-scheme` media query and manual toggle

### TypeScript
Strict mode is enabled. The project uses the Next.js TypeScript plugin for improved type checking.

## Dependencies

- **next: 16.1.4** - React framework
- **react/react-dom: 19.2.3** - UI library
- **antd: ^5.22.4** - UI component library
- **@reduxjs/toolkit: ^2.5.1** - State management
- **react-redux: ^9.2.0** - React bindings for Redux
- **typescript: ^5** - Type safety
- **tailwindcss: ^4** - CSS framework
- **mermaid: ^11.12.2** - Diagram rendering
- **vitest: ^2.1.8** - Testing framework
