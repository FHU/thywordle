# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scripturle is a Bible-themed Wordle clone where players guess Bible verse references (e.g., `JOHN3:16`, `PSALM133:1`) instead of words. Built with React, TypeScript, and Tailwind CSS, with Firebase for authentication and data persistence.

## Commands

```bash
npm start       # Dev server on port 3000
npm run build   # Production build to build/
npm test        # Run Jest tests
npm run lint    # Check Prettier formatting
npm run fix     # Auto-fix formatting
```

## Architecture

### Dual Firebase Projects
- **Main project** (`thywordle-dev`): Auth, user stats, game state, groups, leaderboards, audit logs
- **Daily stats project** (`scripturle-today-dev`): Aggregated daily statistics

### Key Directories
- `src/pages/` - Route pages (Game, Leaderboard, Profile, Groups, etc.)
- `src/components/` - React components organized by feature (grid, keyboard, modals, etc.)
- `src/lib/` - Utility functions and Firebase integration
- `src/lib/firebase/` - Firebase functions (auth, stats with transactions, groups)
- `src/constants/` - Configuration, types, solutions database, settings

### State Management
- **Local storage** (encrypted with Blowfish): theme, game mode, game states, stats
- **React Context**: AlertContext for global notifications
- **Firebase Firestore**: Cross-device sync for authenticated users

### Game Logic
- One game per day, starting from epoch January 1, 2022
- References validated against Bible book database in `src/constants/solutions.ts`
- Hard mode requires using revealed letters in subsequent guesses
- Max 6 guesses per game
- Archived games accessible via `/?d=YYYY-MM-DD` URL parameter

### Scoring System (in `src/constants/settings.ts`)
Points calculated from: win bonus (128/win), loss bonus (4/loss), success rate bonus (64 × %), average guess bonus (1024 scaled), streak bonus (8/day)

### Critical Data Integrity
- Stats updates use Firestore transactions to prevent double score calculation
- `requestId` tracking prevents duplicate submissions
- All stat changes logged to `userStatsAudit` collection

## Path Aliases

TypeScript configured with `@/*` → `src/*` for clean imports.

## Code Style

- Prettier with single quotes, no semicolons
- Import ordering: CSS → third-party → components → constants → context → lib → relative
- Tailwind classes auto-sorted
- Pre-commit hook enforces formatting via Husky

## Key Files

- `src/pages/Game.tsx` - Main game logic and UI
- `src/lib/words.ts` - Reference validation and game dating
- `src/lib/firebase/firebaseStats.ts` - Stats persistence with transactions
- `src/constants/solutions.ts` - Bible verse reference database
- `public/version.json` - Version for cache busting (auto-reloads on deploy)
