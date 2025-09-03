# `.env`

This file contains environment variables used both in [docker-compose.yaml](../../docker-compose.yaml) and in [Caddyfile](../../caddy/Caddyfile) to configure the application and its services.

### `CLIENT_PORT_CONTAINER`

> Port on which the `client` application will be served inside its container. Also used in the Caddyfile for reverse proxying.

### `CLIENT_PORT_HOST`

> Port through which the `client` container will be accessible from the host machine.

### `DATABASE_PORT_CONTAINER`

> Port on which the `database` will be served inside its container.

### `DATABASE_PORT_HOST`

> Port through which the `database` container will be accessible from the host machine.

> [!NOTE]
>
> This must be the same as [`POSTGRES_PORT`](./environment-files-apps-server.md#postgres_port) in the `apps/server/.env` file.

### `REDIS_PASSWORD`

> Password for the [Redis](https://redis.io/) instance running in the `redis` container.

> [!CAUTION]
>
> It is recommended to set a strong password for Redis in production environment to prevent unauthorized access.

### `REDIS_PORT_CONTAINER`

> Port on which the `redis` instance will be served inside its container.

### `REDIS_PORT_HOST`

> Port through which the `redis` container will be accessible from the host machine.

> [!NOTE]
> This must be the same as [`REDIS_PORT`](./environment-files-apps-server.md#redis_port) in the `apps/server/.env` file.

### `SERVER_PORT_CONTAINER`

> Port on which the `server` application will be served inside its container. Also used in the Caddyfile for reverse proxying.

### `SERVER_PORT_HOST`

> Port through which the `server` container will be accessible from the host machine.
