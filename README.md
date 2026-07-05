# Wafra — وفرة

A bilingual (Arabic/English) digital banking frontend, designed and built for the Gulf fintech market.

## Brand identity

| Token | Value | Use |
|---|---|---|
| `emerald-600` | `#0F5C4B` | Primary brand color |
| `gold-500` | `#C9A24B` | Accent (CTAs, highlights) |
| `emerald-900` | `#0A1F1A` | Dark mode base |
| `sand-50` | `#F8F6F0` | Light mode base |

Typography: **Cairo** (Arabic) / **Inter** (English), switched automatically with locale.

## Stack

- React + TypeScript + Vite
- Tailwind CSS (custom design tokens, dark mode via `class` strategy)
- react-i18next (AR/EN with automatic RTL/LTR direction switching)

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
  components/ui/     # Button, Card, Input — shared design system components
  i18n/               # Translation resources + i18n config
  App.tsx             # Demo screen: language switch, dark mode, dashboard preview
```

## Pages

- `/` — marketing landing page (hero, features, security, pricing, CTA)
- `/login`, `/signup`, `/forgot-password`, `/reset-password` — real Supabase Auth (email+password, email OTP, password recovery)
- `/about`, `/careers`, `/contact`, `/privacy`, `/terms` — company/legal pages
- `/dashboard` — account dashboard (overview, transactions, transfer flow, analytics, settings), code-split and lazy-loaded

## Polish notes

- Mobile navigation: hamburger menu on the landing page, bottom tab bar on the dashboard
- `prefers-reduced-motion` respected — GSAP animations are skipped and content renders in its final state
- `prefers-color-scheme` respected — dark mode follows the system preference on first load
- Smooth-scroll anchor links with proper offset for the sticky navbar
- Visible focus states on all interactive elements (keyboard navigation)
- Code-split dashboard bundle (lazy-loaded route)
- Branded favicon and page title/meta description

## Setting up real authentication (Supabase)

Login, signup, and OTP are wired to **Supabase Auth** — a free backend-as-a-service. To activate it:

1. Create a free project at [supabase.com](https://supabase.com) (no credit card required).
2. In your project, go to **Project Settings → API** and copy the **Project URL** and **anon public key**.
3. Copy `.env.example` to `.env` in the project root and paste in your values:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. In Supabase, go to **Authentication → Providers → Email** and make sure Email is enabled. Email OTP (one-time code) works out of the box with this — no extra setup needed.
5. Go to **Authentication → URL Configuration** and add your app's URL (e.g. `http://localhost:5173` for local dev, or your deployed URL later) to **Redirect URLs** — this is required for the "forgot password" email link to work.
6. Run the database schema (next section) so accounts/transactions/goals tables exist.
7. Restart `npm run dev`. Login/signup/OTP/password reset will now hit your real Supabase project.

Without a `.env` file, the app still runs — the login and signup pages show a small notice instead of crashing, and the dashboard falls back to realistic demo data, so the rest of the site works normally without any backend.

> Note: phone-based SMS OTP requires a paid SMS provider (e.g. Twilio) configured in Supabase. This build uses **email OTP**, which is free and works immediately — a common and accepted pattern for Gulf fintech apps.

## Setting up the database

The dashboard (accounts, transactions, savings goals, transfers) reads and writes real rows in Postgres via Supabase, scoped per user with Row Level Security.

1. In your Supabase project, open **SQL Editor → New query**.
2. Paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**.

This creates:
- `accounts`, `transactions`, `goals` tables, each with RLS policies so a user can only ever see their own rows
- A trigger that auto-seeds every new signup with starter accounts (SAR/AED/USD), a welcome transaction, and a starter savings goal
- A `make_transfer` Postgres function that atomically debits the SAR balance and logs the outgoing transaction — called from the app's transfer flow via `supabase.rpc()`

Once this is run, any account created through `/signup` will have real, persisted data — balances, transactions, and goals all live in your Supabase project, not in local mock data. If you're logged out (or `.env` isn't configured), the dashboard falls back to demo data automatically, with a small notice banner so it's always clear which mode you're viewing.

## Deploying to Netlify

This repo includes `netlify.toml` with the build command, publish directory, and the SPA redirect rule React Router needs (without it, refreshing `/dashboard` or any non-root route gives a 404).

**Option A — instant, no GitHub needed:**
1. Run `npm run build` locally (or use the pre-built `dist/` folder from this delivery).
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `dist` folder in.
3. Once deployed, go to **Site settings → Environment variables** and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then trigger a redeploy (**Deploys → Trigger deploy**) so the live build picks them up.

**Option B — recommended, connected to GitHub (auto-deploys on every push):**
1. Push this project to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project → GitHub** → select the repo.
3. Build command: `npm run build`, publish directory: `dist` (Netlify should auto-detect these from `netlify.toml`).
4. Add the same two environment variables under **Site settings → Environment variables** before the first deploy.
5. Add your Netlify URL (e.g. `https://your-site.netlify.app`) to Supabase's **Authentication → URL Configuration → Redirect URLs** so password reset emails work in production too.

## Deploying to GitHub Pages

A GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) builds and deploys automatically on every push to `main`. To enable it:

1. In your GitHub repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions** (not "Deploy from a branch" — that serves raw source files, not the built app, which is why a blank page shows up if you try it).
3. Go to **Settings → Secrets and variables → Actions → New repository secret** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Push any commit to `main` (or go to the **Actions** tab and re-run the workflow manually). After it finishes, your live URL appears under **Settings → Pages** and in the workflow run summary.

This setup also handles two GitHub Pages–specific quirks that otherwise cause a blank page or broken routes:
- **Relative asset paths** (`base: './'` in `vite.config.ts`) — GitHub Pages project sites are served under `/repo-name/`, not the domain root.
- **Client-side routing fallback** — a `404.html` (identical to `index.html`) is generated automatically after every build, so refreshing or deep-linking to `/dashboard` (or any route) still loads the app instead of GitHub's default 404 page.

## Roadmap

- [x] Design tokens (colors, typography, dark/light mode)
- [x] i18n setup with RTL/LTR switching
- [x] Core UI components (Button, Card, Input)
- [x] Marketing landing page
- [x] Account dashboard (balances, transactions, transfers)
- [x] Spending analytics (recharts)
- [x] Budget goals
- [x] Every button wired to a real action (no dead UI)
- [x] Real authentication (Supabase: email/password + email OTP)
- [x] Real database (Supabase Postgres: accounts, transactions, goals, transfers with RLS)
- [x] Password recovery flow (forgot/reset password)
- [x] Basic form validation (email format, password strength, confirmation match)
- [x] Deployment-ready (netlify.toml with SPA redirects)
- [ ] Live on a public URL
