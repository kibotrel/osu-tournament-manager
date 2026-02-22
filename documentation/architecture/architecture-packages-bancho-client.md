# `@packages/bancho-client`

This package is a partial implementation of [RFC 1459](https://datatracker.ietf.org/doc/html/rfc1459) and thus provides an IRC client designed to interact with [bancho](https://osu.ppy.sh/wiki/en/Bancho_%28server%29), osu!'s IRC server.

> [!WARNING]
>
> This client was designed around [bancho](https://osu.ppy.sh/wiki/en/Bancho_%28server%29), its quirks and limited feature set. It is not guaranteed to work with any other fully compliant IRC server.

## 📁 Structure

- [`classes`](/packages/bancho-client/src/classes): Contains classes responsible to handle IRC commands and the main [`BanchoClient`](../../packages/bancho-client/src/classes/ircClient.class.ts).
- [`constants`](/packages/bancho-client/src/constants): All the static data either related to the IRC protocol or bancho specifically.
- [`methods`](/packages/bancho-client/src/methods): Additional helper functions to parse and format data sent to and received from the server.

## 🤔 How does it work ?

This client use an event-driven architecture to provide a simple interface to interact with [bancho](https://osu.ppy.sh/wiki/en/Bancho_%28server%29) multiplayer channels. This allows smoother integration in other parts of the application.

> [!IMPORTANT]
> To keep the client as fast and lightweight as possible, no API calls are made to osu!. It is the consumer's responsibility to fetch any additional data when handling specific events.

Core functionalities are encapsulated in [`BanchoClient`](/packages/bancho-client/src/classes/ircClient.class.ts) which extends Node.js's built-in [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter).

The client is constantly processing incoming packets from the server while connected and with the help of [`IrcCommandFactory`](/packages/bancho-client/src/classes/ircCommandFactory.class.ts), detects how to handle each message and emit the corresponding events.

> [!TIP]
>
> All emitted events by the client are listed in the [`BanchoClientEvent`](/packages/bancho-client/src/constants/banchoClient.constants.ts) enum.

### ✨ Extra features

On top of being able to handle the stream of incoming messages, the client also provides methods to interact with the server and other users. For example, you can:

- Send channel and private messages to other users.
- Create, join and delete multiplayer channels
- Invite users to join a multiplayer channel.
