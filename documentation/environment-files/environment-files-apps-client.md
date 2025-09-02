# `apps/client/.env`

This file contains environment variables used in the `client` application.

### `VITE_BASE_APP_URL`

> Mainly used to construct URLs for API requests and handle OAuth redirection. This is the URL at which you can access the client application.

> [!NOTE]
>
> This must be the same as [`BASE_URL`](./environment-files-apps-server.md#base_url) in the `server` application.

### `VITE_BASE_WEBSOCKET_URL`

> The URL used to connect to the WebSocket server.

### `VITE_OSU_APPLICATION_CLIENT_ID`

> Obtained by creating a [new OAuth application](https://osu.ppy.sh/home/account/edit#oauth) on the osu! website.

> [!NOTE]
>
> This must be the same as [`OSU_CLIENT_ID`](./environment-files-apps-server.md#osu_client_id) in the `server` application.
