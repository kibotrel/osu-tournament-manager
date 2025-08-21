# 🏗️ Architecture

As stated in the main [README.md](../README.md), this project is set up as a monorepo. The code is split into two main categories:

- `apps`: The client and server applications that ultimately make up the tournament manager.
- `packages`: Shared code between the client and server, such as types, utilities, and key systems isolated from the main applications to ease up maintenance and development.

This document provides a high-level overview of core components and their role within the project.

## [`@apps/client`](./architecture-apps-client.md)

> The user interface of this project, allowing users to interact with players in-game, manage tournaments, and view statistics.

## [`@apps/server`](./architecture-apps-server.md)

> Heart of the application, the server is responsible for serving the client with data and bridging with both the osu! API and its IRC server.

## [`@packages/bancho-client`](./architecture-packages-bancho-client.md)

> Programmatic IRC client designed to interact with the osu! IRC server, providing a simple interface through an event-driven architecture.

## [`@packages/shared`](./architecture-packages-shared.md)

> Shared code between the client and server, including types and utiliities that are used across the application.
