# Project

As stated in the main [README.md](../../README.md), you'll need several tools installed on your machine in order to run this project locally:

- [`docker`](https://www.docker.com/)
- [`nvm`](https://github.com/nvm-sh/nvm)
- [`pnpm`](https://pnpm.io/)
- [`caddy` CLI](https://caddyserver.com/)

## Installation Steps

- Clone the repository and run the following commands in the root directory.

  ```shell
  nvm install && pnpm install
  ```

- Add an entry in your `/etc/hosts` file to allow fake domain resolution.

  ```plaintext
  127.0.0.1       dev.osu-tournament-manager.app
  ```

- Create `.env` files at root directory and both in `apps/client` and `apps/server` directories. See [Environment](../environment-files/README.md) documentation if you need more information about their purpose and how to set them up.

  ```shell
  cp .env.example .env
  cp apps/client/.env.example apps/client/.env
  cp apps/server/.env.example apps/server/.env
  ```

- Go on osu! website and [create an OAuth application](https://osu.ppy.sh/home/account/edit#new-oauth-application) and save both `Client ID` and `Client Secret` values in the corresponding environment variables in [`apps/client/.env`](../../apps/client/example.env) and [`apps/server/.env`](../../apps/server/example.env) files.

> [!IMPORTANT]
>
> Be sure to use `https://dev.osu-tournament-manager.app/oauth/callback` as callback URL.

- While you're at it, go to [IRC settings](https://osu.ppy.sh/home/account/edit#legacy-api) and get your credentials. Save them in the corresponding environment variables in [`apps/server/.env`](../../apps/server/example.env) file.

- Build and start the project using `docker-compose`.

  ```shell
  docker-compose up -d --build
  ```

> [!TIP]
>
> This launches all the containers in detached mode to avoid log flooding. You can still access the logs using `docker-compose logs -f <container_name>`.

- Since we're using HTTPS locally, you must trust Caddy's local certificate authority to avoid browser warnings.

  ```shell
  sudo caddy trust
  ```

> [!NOTE]
>
> If you ever need to untrust Caddy's local certificate authority, you can run `sudo caddy untrust`.

- Connect to the `server` container and run the database migrations.

  ```shell
  docker-compose exec -it server /bin/sh -c "pnpm db:migrate"
  ```

- You can now access the application at [https://dev.osu-tournament-manager.app](https://dev.osu-tournament-manager.app) and start moding around!
