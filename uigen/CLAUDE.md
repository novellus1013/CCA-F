# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup        # First-time setup: install, generate Prisma client, run migrations
npm run dev          # Start dev server (Turbopack) at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm test             # Run all tests (Vitest + jsdom)
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx  # Run a single test file
npm run db:reset     # Reset SQLite database (destructive)
```

The dev script requires `NODE_OPTIONS='--require ./node-compat.cjs'` — this is already baked into all npm scripts.

## Environment

Copy `.env` and set:
- `ANTHROPIC_API_KEY` — without this, a mock provider returns static code instead of calling Claude
- `JWT_SECRET` — defaults to `"development-secret-key"` if unset

## Architecture

UIGen is a Next.js 15 (App Router) app where users chat with Claude to generate React components and see them rendered live.

### Data flow

1. **Chat** — `ChatContext` (`src/lib/contexts/chat-context.tsx`) wraps Vercel AI SDK's `useChat`. On each submit it POSTs to `/api/chat` with the current messages and the serialized virtual file system.

2. **AI route** (`src/app/api/chat/route.ts`) — streams `streamText` responses using two tools: `str_replace_editor` (create/edit files) and `file_manager` (rename/delete). Tool calls are streamed back to the client in real time.

3. **Virtual file system** — `VirtualFileSystem` (`src/lib/file-system.ts`) is an in-memory store with no disk I/O. `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`) wraps it and applies incoming tool calls via `handleToolCall`, triggering a `refreshTrigger` counter that downstream consumers watch.

4. **Preview** — `PreviewFrame` (`src/components/preview/PreviewFrame.tsx`) renders an `<iframe srcdoc>`. On each refresh it calls `createImportMap` + `createPreviewHTML` from `src/lib/transform/jsx-transformer.ts`, which transpiles every `.jsx/.tsx` file with Babel Standalone, creates `blob:` URLs, builds an ES import map (with `@/` alias support), and loads third-party packages from `esm.sh`. Tailwind CSS is injected via CDN.

5. **Persistence** — projects are stored in SQLite via Prisma. `messages` and `data` (serialized VFS) are stored as JSON strings on the `Project` model. Only authenticated users get persistence; anonymous sessions track work in `localStorage` via `anon-work-tracker.ts`. The database schema is defined in `prisma/schema.prisma` — reference it anytime you need to understand the structure of data stored in the database.

### Auth

JWT-based sessions stored in an `httpOnly` cookie (`auth-token`). `src/lib/auth.ts` handles signing/verifying with `jose`. Middleware (`src/middleware.ts`) protects `/api/projects` and `/api/filesystem` routes.

### Code style

Use comments sparingly. Only comment complex code.

### Key conventions

- The AI is instructed (via `generationPrompt`) to always create `/App.jsx` as the entry point, use Tailwind for styling, and use `@/` import aliases for local files.
- `src/components/ui/` contains shadcn/ui primitives — prefer extending these over creating new primitives.
- Prisma client is generated into `src/generated/prisma/` (not the default location).
- Tests live in `__tests__/` subdirectories alongside their source and use `@testing-library/react` + `jsdom`.
- Vitest config is in `vitest.config.mts`.
