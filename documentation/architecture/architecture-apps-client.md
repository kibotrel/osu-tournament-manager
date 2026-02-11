# `@apps/client`

This is the main interface for users to interact with the application. It is built using [Vue.js](https://vuejs.org/), [Tailwind CSS](https://tailwindcss.com/), [Tanstack Query](https://tanstack.com/query/latest) and [Vite](https://vitejs.dev/).

## 📁 Structure

The client is structured into several directories, each serving a specific purpose.

- [`api`](../../apps/client/src/api/): Contains composable functions to interact with the server API.
- [`assets`](../../apps/client/src/assets/): Holds static assets like images, fonts, and stylesheets.
- [`components`](../../apps/client/src/components/): Basic building blocks of the application, such as buttons, modals, and form elements.
- [`composables`](../../apps/client/src/composables/): Contains reusable logic and reactive behavior that can be shared across components.
- [`locales`](../../apps/client/src/locales/): Contains localization files for supporting multiple languages.
- [`pages`](../../apps/client/src/pages/): Higher-level components representing different pages or views in the application, file-tree in this directory corresponds to the routing structure.
- [`plugins`](../../apps/client/src/plugins/): Holds Vue plugins and third-party custom integrations.
- [`router`](../../apps/client/src/router/): Manages application routing using [Vue Router](https://router.vuejs.org/).
- [`stores`](../../apps/client/src/stores/): Client state management using [Pinia](https://pinia.vuejs.org/).
- [`types`](../../apps/client/src/types/): TypeScript type definitions used throughout the client.

## ✨ Design System

> [!TIP]
> The design system is only available in development mode at https://dev.osu-tournament-manager.app/design-system.

The design system is a collection of reusable components and styles that ensure a consistent look and feel across the application. It is built using [Tailwind CSS](https://tailwindcss.com/) with a strong inspiration from [`shadcn/ui`](https://ui.shadcn.com/). This help us to avoid using external UI libraries, which can be limiting and hard to customize.

## 💬 Real-time communication

To allow real-time communication between the client and osu! multiplayer lobbies, we use [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) to send and receive various events. This is made possible thanks to the server which acts as a bridge between the client and osu! using [`@packages/bancho-client`](./architecture-packages-bancho-client.md), our own custom IRC client tailored for [bancho](https://osu.ppy.sh/wiki/en/Bancho_%28server%29).

## 🤩 Developer experience

Like for the server, some tools are present on the client to improve developer experience.

- [Vue Devtools](https://devtools.vuejs.org/) to inspect and debug Vue components.
- [Pinia Devtools](https://pinia.vuejs.org/cookbook/devtools.html) to inspect and debug Pinia stores.
- Hot module replacement to see changes in real-time without refreshing the page thanks to [Vite](https://vitejs.dev/).

> [!TIP]
>
> To simplify localization work, there is a VSCode extension called [i18n-ally](https://github.com/lokalise/i18n-ally) that provides a nice interface to manage translation files and keys directly from the editor.
