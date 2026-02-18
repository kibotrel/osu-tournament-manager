# Specific server guidelines

This document contains guidelines that only apply to the `@apps/sever` directory.

## File structure

As already mentioned in [server architecture](../architecture/architecture-apps-server.md), the `@apps/server` directory is structured in a specific way. On top of that should be mentioned:

- The overall request flow should be as follows: `route` -> `validator` -> `middleware` -> `controller` -> `service` -> `query`.
- API versioning is enforced in `controllers`, `routes`, `services` and `validators`. There could be multiple `v<versionNumber>` folders in each of these layers in which all files must be placed.
  ```
  src
  ├── constants
  │   └── http.constants.ts
  ├── controllers
  │   └── v1
  │       └── authentication
  │           └── authentication.login.controller.ts
  ├── queries
  │   └── users
  │       └── users.create.queries.ts
  ├── schemas
  │   └── users
  │       ├── users.schema.ts
  │       └── users.table.ts
  └── services
      └── v1
          └── login
              └── login.withOsu.service.ts
  ```
  > Simplified and partial structure of `@apps/server`.

## Naming

Generally speaking file naming is dictated by the folder where it lives. The pattern is `<topic>.<subject>.<type>.ts`. `topic` is not always required. See example in the above simplified file structure.

> [!NOTE]
>
> It applies to every top level folder in `@apps/server`. It allows to easily find files either based on feature (e.g. `login`) or purpose (e.g. `controller`).

## Data flow

- Data serialization must occur at the service level if needed.
- Move database entities between services as much as possible to avoid re-fetching the same data multiple times.

## Queries

- Queries should return `null` if the requested data is a specific item that does not exist, and an empty array if the requested data is a list of items that do not exist.
- One file per kind of queries ([CRUD](https://fr.wikipedia.org/wiki/CRUD)) per entity.
  ```
  queries
  └── users
      ├── users.create.queries.ts
      ├── users.delete.queries.ts
      ├── users.get.queries.ts
      └── users.update.queries.ts
  ```
- Only query fields that are required to keep the query efficient as time goes by.

## Logging

- Use the `Logger` instantiated in `dependencies/logger.dependency.ts` with the right level to track key events in the application.

> [!TIP]
>
> - `debug` for debugging purposes.
> - `error` for expected errors that could occur in production.
> - `http` for inbound and outbound HTTP requests.
> - `info` for important information that could be useful in production.
> - `verbose` for very detailed information that could be useful in development.
> - `warn` for anticipated functional issues that should be monitored but do not require immediate attention.
