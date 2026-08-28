# SideQuest

SideQuest is a cozy adventure-planning app for finding small, realistic activities based on your mood, energy, available time, and interests.

Live project: [https://sidequest-next-preview.vercel.app](https://sidequest-next-preview.vercel.app)

## Features

- Random quest generator, personalized quiz, Saved Quests search, and Adventure Log
- Supabase Google OAuth and email/password authentication
- Editable profiles with avatar uploads and automatic profile creation
- Owner-only custom quest CRUD and administrator quest management
- SideQuest Guide chat and paid AI Quest Remix
- Stripe test-mode one-time purchases and monthly subscriptions
- Upstash-backed rate limiting, signed Stripe webhooks, and Resend welcome email
- Feedback widget, Vercel Web Analytics, and privacy-first Sentry monitoring
- SEO landing pages, database-generated quest pages, JSON-LD, sitemap, and robots metadata
- Responsive light/dark themes with accessible navigation and reduced-motion support

## Tech stack

- Next.js 16 App Router, React 19, and JavaScript
- Supabase Auth, Postgres, Row Level Security, and Storage
- OpenAI, Stripe, Upstash Redis, and Resend
- Vercel Analytics, Sentry, Vitest, and ESLint
- Vercel deployment

## Local development

Use Node.js 20.9 or newer.

```bash
npm install
```

Copy `.env.example` to `.env.local`, add the required values for the services you want to exercise, and then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Browser-safe Supabase configuration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Server-only configuration:

- `SUPABASE_SECRET_KEY`
- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_KV_REST_API_URL`
- `UPSTASH_REDIS_REST_KV_REST_API_TOKEN`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Never expose the server-only values through `NEXT_PUBLIC_*` variables. Sentry uses its browser-safe public DSN from the shared Sentry configuration and does not require a private runtime token.

## Database setup

The repository includes reviewed SQL files for profiles, roles, public/admin quests, user-owned quests, entitlements, subscriptions, feedback, avatar storage, auto-profiles, and welcome-email permissions. Run only the required SQL manually in the Supabase SQL Editor after reviewing it. Never place a service-role or secret key in browser code.

## Quality checks

```bash
npm run test:run
npm run lint
npm run build
```

The automated Vitest suite exercises request validation, safe redirects, AI input validation, quest matching and storage, feedback validation, public quest routes, and structured data without contacting production services.

## Deployment

Deploy `next-app/` as the Vercel project root and configure the environment-variable names above for the appropriate Preview and Production environments. Stripe remains in test mode for this portfolio project.
