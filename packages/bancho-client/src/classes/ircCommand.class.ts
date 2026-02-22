import type { BanchoClient } from '#src/classes/ircClient.class.js';

export abstract class IrcCommand {
  public abstract readonly banchoClient: BanchoClient;

  public abstract handleCommand(): void | Promise<void>;
}
