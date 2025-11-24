# Movie Magic Frontend (Next.js)

A minimalist-yet-premium interface for the Movie Magic AI backend. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, Cousine typography, and React Query for resilient API access.

## Getting Started

1. Install dependencies

```bash
cd frontend
npm install
```

2. Create an `.env.local` file

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

3. Run the dev server

```bash
npm run dev
```

4. Run tests & linting

```bash
npm test
npm run lint
```

## Project Structure

```
src/
├─ app/          # Next.js App Router pages/layouts
├─ components/   # UI building blocks (chat, movies, shared)
├─ hooks/        # React Query hooks for chat + discovery
├─ lib/          # API client, helpers, constants
├─ providers/    # Cross-app providers (React Query, theming)
├─ styles/       # Tailwind layer extensions if needed
└─ types/        # Shared TypeScript contracts
```

## Testing

Vitest + Testing Library cover UI atoms/utilities. Extend `tests/` as you add features. Use Playwright for E2E once flows solidify.

## Deployment

The app is Vercel-ready. Configure `NEXT_PUBLIC_API_BASE_URL` to your deployed FastAPI instance and `npm run build` before pushing.
