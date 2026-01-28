# Copilot Instructions for osu-tournament-manager

## Project Overview

- **Monorepo structure**: Two main categories:
  - `apps/`: Contains `client` (Vue.js) and `server` (Express.js) applications.
  - `packages/`: Shared code (types, utilities, SDKs) for both client and server.
- **Purpose**: All-in-one open-source app to manage osu! tournaments, with privacy and ownership of tournament data.

## Architecture & Data Flow

- **Client**: SPA built with Vue.js, communicates with server via REST APIs and possibly websockets.
  - UI components in `apps/client/src/components/`, pages in `apps/client/src/pages/`.
  - State management with Pinia in `apps/client/src/stores/`.
  - Routing with Vue Router in `apps/client/src/router/`.
  - API calls using VueQuery in `apps/client/src/api/`.
- **Server**: Express.js app, handles tournament logic, user management, and external integrations (osu! API, IRC, etc).

  - API routes in `apps/server/src/routes/`.
  - Business logic in `apps/server/src/services/`.
  - Middleware in `apps/server/src/middleware/`.
  - Controllers in `apps/server/src/controllers/`.
  - Validators using express-validator in `apps/server/src/validators/`.
  - **Database**: PostgreSQL for persistent storage, managed via Drizzle ORM.
  - **Custom WebSocket Server**: The server includes a custom WebSocket server ([`WebSocketServer`](../apps/server/src/classes/webSocketServerClass.ts)) implementation, which provides:
    - Request authentication using session middleware.
    - Heartbeat mechanism (ping/pong) to detect and close dead connections.
    - Topic-based message broadcasting for real-time features (e.g., match chat).
    - Integration with osu! IRC via [`@packages/bancho-client`](../packages/bancho-client).

- **Shared packages**: Types, API specifications, logging, and SDKs are in `packages/` for strict type safety and code reuse.
- **Documentation**: See `documentation/architecture/` for detailed component breakdowns.

## Developer Workflows

- **Install dependencies**: Use `pnpm install` at the root.
- **Build**: Use `pnpm build` (see individual app/package for scripts).
- **Run locally**: Use Docker Compose (`docker-compose.yaml`) or run apps directly:
  - Server: `pnpm --filter ./apps/server dev`
  - Client: `pnpm --filter ./apps/client dev`
- **Testing**: Use `pnpm test` or `pnpm vitest` (see `vitest.workspace.ts`).
- **Lint/Format**: Use `pnpm lint` and `pnpm format` (see `prettier.config.js`, `commitlint.config.js`).

## Conventions & Patterns

- **TypeScript everywhere**: Strict typing enforced across all apps and packages.
- **Environment files**: Example envs in `example.env` (see `documentation/environment-files/`).
- **Service boundaries**: Business logic is in `apps/server/src/services/`, API routes in `apps/server/src/routes/`.
- **Shared types**: Use types from `packages/shared` for API contracts and models.
- **Testing**: Unit tests in `apps/server` and `apps/client` under `src/` or dedicated test folders.
- **Docker**: Dev Dockerfile in `docker/`, compose setup in root.

## Integration Points

- **osu! API**: See `packages/osu-sdk/` for API integration.
- **IRC**: See `apps/server/bancho.txt` and related services.
- **Caddy**: Reverse proxy config in `caddy/Caddyfile`.

## Examples

- To add a new API route: create in `apps/server/src/routes/`, use types from `packages/shared`, implement logic in `apps/server/src/services/`.
- To share a utility: add to `packages/shared/` and import in client/server.

## References

- Main docs: `README.md`, `documentation/README.md`, `documentation/architecture/README.md`
- For environment/config: `documentation/environment-files/README.md`
- For installation: `documentation/installation/README.md`
