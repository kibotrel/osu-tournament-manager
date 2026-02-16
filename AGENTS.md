# AGENTS.md

Essential information for AI agents working on **osu-tournament-manager**.

## Project Overview

- **Purpose**: Open-source osu! tournament management app with data privacy.
- **Architecture**: Monorepo using `pnpm` workspaces.
- **Apps**: `apps/client` (Vue.js 3, Vite, Tailwind, Pinia), `apps/server` (Express.js, Drizzle ORM, PostgreSQL, Redis, WebSockets).
- **Shared Code**: `packages/` contains shared types and SDKs.

## Commands

| Command                                                                 | Purpose                |
| ----------------------------------------------------------------------- | ---------------------- |
| `pnpm install`                                                          | Install dependencies   |
| `pnpm lint` / `pnpm format`                                             | Lint/format all        |
| `pnpm test`                                                             | Run all tests (Vitest) |
| `pnpm --filter @apps/client dev\|build\|type-check`                     | Client commands        |
| `pnpm --filter @apps/server dev\|build\|test:unit\|db:migration:create` | Server commands        |

## Database & Infrastructure

- **PostgreSQL**: Drizzle ORM, migrations via `drizzle-kit`.
- **Redis**: Sessions and caching.
- **WebSockets**: Custom `WebSocketServer` with auth, heartbeat, topic broadcasting.
- **osu! Integration**: API v2 via `@packages/osu-sdk`, IRC via `@packages/bancho-client`.
- **Docker**: Compose in `docker-compose.yaml` with Caddy as reverse proxy in `caddy/Caddyfile`.

## Testing

- **Framework**: Vitest.
- **Naming**: `*.unit.test.ts` or `*.integration.test.ts` co-located with source.
- **Mocks**: Use `vi.mock()` for external dependencies.

## References

- Docs: `README.md`, `documentation/`
- Coding conventions: `documentation/coding-conventions/`
- Architecture and file structure: `documentation/architecture/`
- Setup: `documentation/environment-files/`, `documentation/installation/`

---

_For AI agents: Follow these patterns strictly when contributing._
