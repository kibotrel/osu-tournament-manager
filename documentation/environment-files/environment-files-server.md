# `apps/server/.env`

This file contains environment variables used in the `server` application.

### `BASE_URL`

> Mainly used to configure the Websocket server and OAuth redirection, this should be the URL at which you can access the client application.

### `EXPRESS_PORT`

> The port on which the [`express`](https://expressjs.com/) server will run.

### `NODE_ENV`

> Defines the environment in which the application is running.

### `OSU_CLIENT_ID`

> Obtained by creating a [new OAuth application](https://osu.ppy.sh/home/account/edit#oauth) on the osu! website.

### `OSU_CLIENT_SECRET`

> Obtained by creating a [new OAuth application](https://osu.ppy.sh/home/account/edit#oauth) on the osu! website.

### `OSU_IRC_CLIENT_PASSWORD`

> Obtained in the [IRC settings](https://osu.ppy.sh/home/account/edit#legacy-api) of your osu! account.

### `OSU_IRC_CLIENT_USERNAME`

> Obtained in the [IRC settings](https://osu.ppy.sh/home/account/edit#legacy-api) of your osu! account.

### `POSTGRES_DB`

> The name of the PostgreSQL database to connect to.

### `POSTGRES_HOST`

> The hostname of the PostgreSQL server.

### `POSTGRES_PASSWORD`

> The password for the PostgreSQL user.

### `POSTGRES_PORT`

> Port on which the PostgreSQL server is running.

### `POSTGRES_USER`

> Username that will be used to connect to the PostgreSQL database.

### `REDIS_HOST`

> The hostname of the Redis server.

### `REDIS_PASSWORD`

> The password for the Redis server.

### `REDIS_PORT`

> Port on which the Redis server is running.

### `SESSION_SECRET`

> A secret string used to sign [`express-session`](https://expressjs.com/en/resources/middleware/session.html) objects stored in Redis cache.
