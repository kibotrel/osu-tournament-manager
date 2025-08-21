# Project

As stated in the main [README.md](../../README.md), you'll need several tools installed on your machine in order to run this project locally:

- [`docker`](https://www.docker.com/)
- [`nvm`](https://github.com/nvm-sh/nvm)
- [`pnpm`](https://pnpm.io/)
- [`caddy` CLI](https://caddyserver.com/)

## Installation Steps

- Clone the repository and run the following commands in the root directory.

  ```shell
  nvm install
  pnpm install
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
