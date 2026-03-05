# Tates Trading Post - Comic Book CMS

A custom comic book store website powered by PayloadCMS 3 and Next.js 15, featuring dynamic page building, product management, and interactive UI elements.

## Quick Start

```bash
cd tates-trading-post
npm install
npm run dev
```

Visit http://localhost:3000 for the frontend and http://localhost:3000/admin for the CMS.

## Project Structure

```
Database-Project/
├── tates-trading-post/          # Main Next.js + PayloadCMS application
│   ├── src/                     # Source code
│   │   ├── app/                 # Next.js App Router
│   │   ├── blocks/              # Custom page builder blocks
│   │   ├── heros/               # Hero section variants
│   │   ├── collections/         # PayloadCMS collections
│   │   ├── components/          # React components
│   │   └── globals/             # Site-wide settings
│   ├── public/                  # Static assets
│   ├── cms.db                   # PayloadCMS content database
│   ├── business.db              # Business logic database
│   └── package.json             # Dependencies
├── docs/                        # Project documentation
│   ├── templates/               # Original HTML/CSS/JS templates
│   └── *.md                     # Implementation guides
├── DATABASE-ARCHITECTURE.md     # Database architecture guide
└── TATES-TEMPLATE-INTEGRATION.md # Template integration reference
```

## Key Features

- **Dynamic Page Builder**: Custom blocks for bento grids, events, and vintage sections
- **Comic Product Management**: Enhanced with badges, grading, and categorization
- **Event Management**: Display upcoming comic shop events
- **Interactive UI**: Kinetic typography, custom cursor, FPS monitor
- **Glassmorphism Design**: Modern aesthetic with backdrop blur effects
- **Dual Database Setup**: Separate CMS and business logic databases

## Documentation

- **[Database Architecture](DATABASE-ARCHITECTURE.md)**: Understanding the dual-database setup
- **[Template Integration](TATES-TEMPLATE-INTEGRATION.md)**: Custom components and features
- **[Implementation Guides](docs/)**: Detailed implementation documentation

## Tech Stack

- Next.js 15.4.4
- PayloadCMS 3.61.1
- React 19.1.0
- TypeScript 5.7.3
- Tailwind CSS 3.4.3
- SQLite (via @payloadcms/db-sqlite)

## Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Generate TypeScript types
npm run generate:types

# Lint and fix
npm run lint:fix
```

## Database Management

The project uses a dual-database architecture:
- **cms.db**: PayloadCMS content management (pages, products, events, media)
- **business.db**: Business-specific data and logic

See [DATABASE-ARCHITECTURE.md](DATABASE-ARCHITECTURE.md) for details.

## License

MIT
