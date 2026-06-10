# Kasbon Foundation Architecture

This workspace is intentionally scaffolded without UI pages or components.
The goal is to establish a clean technical base for a personal debt-tracking app built with Next.js 16, TypeScript strict, Tailwind CSS v4, and Supabase.

## Technical Decisions

- Next.js App Router is the default because the project needs server-first routing, middleware, and future server actions.
- TypeScript strict is enabled so domain rules and Supabase data access stay predictable.
- Tailwind CSS v4 is kept as a dependency, but no UI layer is introduced yet to honor the requirement.
- Supabase SSR wrappers are isolated in `src/lib/supabase` so auth/session logic stays centralized.
- Route guards live in middleware so protected access is enforced before application code runs.
- Domain types live under `src/types` so the data model is explicit before UI work starts.
- Small focused helpers are preferred over a large shared utility dump to keep the codebase scalable.

## Proposed Folder Structure

```text
src/
  config/
  lib/
    auth/
    debt/
    supabase/
    utils/
  types/
```

## Implementation Order

1. Environment variables and package installation.
2. Supabase project setup and SQL schema.
3. Auth flow and middleware protection.
4. Debt, repayment, and dashboard data access helpers.
5. UI pages and components after the foundation is stable.
