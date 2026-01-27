# T-Tool - Developer Tools Collection

A collection of developer tools built with Next.js 16, Redux Toolkit, Ant Design, and Tailwind CSS.

## Features

### String Tools
- **Base64** - Base64 encoding/decoding
- **URL Encoder** - URL encoding/decoding
- **JSON Formatter** - JSON formatting, minifying, and validation
- **HTML Formatter** - HTML formatting/minifying
- **SQL Formatter** - SQL statement formatting/minifying
- **Regex Tester** - Regular expression testing with match highlighting and replace

### Other Tools
- **Mermaid** - Mermaid diagram editor with multiple diagram types
- **Timestamp** - Unix timestamp and date string conversion
- **UUID** - UUID v1/v4/v5 generator

### Mini Games
- **Tetris** - Classic Tetris game with dark/light mode support

### Key Features
- **Dark Mode** - Light/Dark/System auto modes
- **i18n Support** - Chinese and English interface
- **Persistence** - Theme and language preferences saved automatically
- **Responsive Design** - Optimized for desktop and mobile

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework (App Router) |
| Redux Toolkit | Global state management |
| Ant Design v5 | UI component library |
| Tailwind CSS v4 | CSS framework |
| Vitest | Unit testing |
| TypeScript | Type safety |

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 9+

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run linter |
| `pnpm test` | Run unit tests |
| `pnpm test:coverage` | Run tests with coverage report |

## Project Structure

```
t-tool/
├── app/                           # Next.js app directory
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles (Tailwind CSS v4)
│   ├── providers.tsx              # Redux + Ant Design Provider
│   └── tools/                     # Tool pages
│       ├── base64/                # Base64 tool
│       ├── url-encoder/           # URL encoder tool
│       ├── json-formatter/        # JSON formatter tool
│       ├── html-formatter/        # HTML formatter tool
│       ├── sql-formatter/         # SQL formatter tool
│       ├── regex-tester/          # Regex tester tool
│       ├── mermaid/               # Mermaid editor
│       ├── timestamp/             # Timestamp converter
│       ├── uuid/                  # UUID generator
│       └── games/                 # Mini games
│           └── tetris/            # Tetris game
├── components/                    # React components
│   └── ui/                        # UI components
│       ├── Layout.tsx             # App layout component
│       ├── ThemeToggle.tsx        # Theme toggle button
│       ├── LanguageSwitcher.tsx   # Language switcher button
│       └── ToolCard.tsx           # Tool card component
├── contexts/                      # React Context
│   └── I18nContext.tsx            # Internationalization context
├── lib/                           # Library files
│   └── store/                     # Redux Store
│       ├── index.ts               # Store configuration
│       ├── hooks.ts               # Typed Redux hooks
│       └── slices/
│           └── themeSlice.ts      # Theme state management
├── utils/                         # Utility functions
│   ├── string/                    # String processing
│   │   ├── base64.ts
│   │   ├── url.ts
│   │   ├── json.ts
│   │   ├── html.ts
│   │   └── regex.ts
│   ├── sql/
│   │   └── formatter.ts
│   └── other/                     # Other utilities
│       ├── mermaid.ts
│       ├── timestamp.ts
│       └── uuid.ts
├── tests/                         # Test files
│   ├── string/
│   ├── other/
│   └── games/                      # Game tests
│       └── tetris.test.ts          # Tetris game tests
├── CLAUDE.md                      # Claude Code guidance
├── README.md                      # Chinese documentation
└── README_EN.md                   # English documentation
```

## Test Coverage

The project uses Vitest for unit testing with coverage for:

- Base64 encoding/decoding (6 tests)
- URL encoding/decoding (7 tests)
- JSON formatting/validation (7 tests)
- HTML formatting/minifying (5 tests)
- SQL formatting/minifying (19 tests)
- Regular expressions (8 tests)
- Timestamp conversion (6 tests)
- UUID generation (10 tests)
- Mermaid utilities (10 tests)

## License

MIT License
