# ManagAI Platform – AI-powered e-commerce automation
Created: 2025-08-12
Updated: 2025-01-13 (Next.js 15 + Tailwind CSS 4 migration)

This repo scaffold contains the **CORE Agy** (Event → Rule → Action) interfaces and the **MVP modules (v1)** stubs so you can start coding in **Cursor AI** immediately.

## What's inside
- Next.js route handlers for:
  - `POST /api/events` – unified event intake (Shopify/Woo/Simulated)
  - `POST /api/run-rule` – manual rule test
  - `POST /api/demo/simulate` – event simulator for demos
- Rule engine skeleton (`src/lib/rules/engine.ts`)
- Type definitions (`src/lib/types.ts`)
- Supabase schema (`src/lib/db/schema.sql`)
- Basic UI pages: dashboard, connectors, rules
- Public widgets:
  - `widget.js` – Free‑Shipping Nudger + Chatbot demo snippet
- Playbook samples (`docs/playbooks/*.json`)
- `.env.example` for local development

## Quick start (with Cursor AI)
1. Create a fresh Next.js app (TypeScript) in Cursor:
   ```bash
   npx create-next-app@latest managai --ts --eslint --app --src-dir --tailwind --import-alias "@/*"
   ```
2. Copy the contents of this ZIP into the new project, **merging** folders.
3. Install deps:
   ```bash
   npm i zod uuid
   ```
   (Add your mail provider SDK if needed; SES/Mailgun can be HTTP-called via your server routes.)
4. Create a Supabase project → paste `src/lib/db/schema.sql` into the SQL editor.
5. Fill `.env.local` from `.env.example`.
6. Run:
   ```bash
   npm run dev
   ```
7. Open `/dashboard` and `/connectors`. Use `/api/demo/simulate` to generate events.
8. Start implementing adapters in `src/lib/rules/actions/*` and real connectors under `src/app/api/connectors/*`.

## Conventions
- **Idempotency:** every event carries an `idemp_key`. We use an outbox/inbox pattern later.
- **Exactly-once** (aspirational in v1): ensure dedupe by `(org_id, idemp_key)` unique index.
- **Playbook-first:** Users toggle recipes; rules are generated from JSON (see `docs/playbooks`).

## Next steps
- Implement `email.send` adapter (SES/Mailgun).
- Implement Shopify OAuth + webhooks → forward to `/api/events` as unified events.
- Wire up the Free‑Shipping nudger bar to your demo storefront with `public/widget.js`.
