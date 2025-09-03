# Osu tournament manager

[![License](https://img.shields.io/github/license/kibotrel/osu-tournament-manager)](./LICENSE)
![GitHub contributors](https://img.shields.io/github/contributors/kibotrel/osu-tournament-manager)

All-in-one application to manage osu! tournaments built using [`express`](https://expressjs.com/) and [`Vue.js`](https://vuejs.org/) written in TypeScript.

Everything is open-source and licensed under the [GNU GPLv3 License](./LICENSE). Feel free to use, modify or host your own instance of the application to keep ownership and privacy of tournament data you create.

## 🛠️ Install

If you want to run this project locally, be sure to have the following tools installed on your machine:

- [`docker`](https://www.docker.com/)
- [`nvm`](https://github.com/nvm-sh/nvm)
- [`pnpm`](https://pnpm.io/)
- [`caddy` CLI](https://caddyserver.com/)

Then follow the steps described in the [Install](./documentation/installation/installation-project.md) documentation.

## 🏗️ Architecture

This project is set up as a monorepo, code is split into two main categories:

- `apps`: The client and server applications that ultimately make up the tournament manager.
- `packages`: Shared code between the client and server, such as types, utilities, and key systems isolated from the main applications to ease up maintenance and development.

More information about the architecture can be found in the [Architecture](./documentation/architecture/README.md) documentation.
