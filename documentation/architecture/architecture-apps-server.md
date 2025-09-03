# `@apps/server`

> [!TIP]
> An OpenAPI specification document is exposed on [/api/documentation](https://dev.osu-tournament-manager.app/api/documentation/) endpoint, to ease up discovery of the API and its capabilities.

This is the core component of this project, built using [`express`](https://expressjs.com/), it is responsible for serving the client with data and bridging with both the osu! API through [`@packages/osu-sdk`](./packages-osu-sdk.md) and its IRC server via [`@packages/bancho-client`](./packages-bancho-client).

## 📁 Structure

The server is structured into several directories, each serving a specific purpose.

- [`classes`](../../apps/server/src/classes/): Contains classes that encapsulate logic specific to more complex operations.
- [`configs`](../../apps/server/src/configs/): Holds configuration objects populated from environment variables, such as database connection settings and API keys.
- [`constants`](../../apps/server/src/constants/): Contains constants used throughout the application, helping to avoid magic strings and numbers.
- [`controllers`](../../apps/server/src/controllers/): Implements the logic for handling requests and responses, acting as the bridge between the `routes` and the `services`.
- [`dependencies`](../../apps/server/src/dependencies/): Contains initialization code for dependencies like the database connection, logger, and others.
- [`middlewares`](../../apps/server/src/middlewares/): Implements middleware functions that can be used to process requests before they reach the controllers, such as authentication and validation.
- [`queries`](../../apps/server/src/queries/): Here lies the database queries organized by entity.
- [`routes`](../../apps/server/src/routes/): Defines the API endpoints and maps them to the appropriate `controllers` following RESTful principles.
- [`schemas`](../../apps/server/src/schemas/): Defines PostgreSQL objects such as schemas, tables and enums using [`drizzle-orm`](https://orm.drizzle.team/).
- [`services`](../../apps/server/src/services/): Contains the business logic of the application, interacting with the `queries` and `controllers` to perform operations.
- [`tests`](../../apps/server/src/tests/): Contains utility functions and mocks to ease up testing of the application.
- [`validators`](../../apps/server/src/validators/): Implements input validation logic for the API endpoints, ensuring that the data received is in the expected format.

## 🔒 Security

To enforce security and integrity across the API, there are several systems in place.

- Session management using [`express-session`](https://github.com/expressjs/session#readme) stored in a [`redis`](https://redis.io/) instance.
- HTTP requests input validation with [`express-validator`](https://express-validator.github.io/docs/).
- OpenAPI specification is the source of truth, thanks to [`express-openapi-validator`](https://github.com/cdimascio/express-openapi-validator#readme).

## 🤩 Developer experience

We believe that a good developer experience leads to a better product, ship code faster and with more confidence and to overall better maintainability. Here are some of the features we implemented to achieve that.

- Request tracking to debug issues more easily (see [`requestIdentityMiddleware`](../apps/server/src/middlewares/requestIdentityMiddleware.ts)).
- Global error handling to catch and log errors in a consistent manner (see [`errorHandlerMiddleware`](../apps/server/src/middlewares/errorHandlerMiddleware.ts)).
- Small API to gauge performance using [HTTP Server-Timing header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) (see [`metricsCollectorClass`](../apps/server/src/classes/metricsCollectorClass.ts)).
