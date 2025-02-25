import type { BanchoClient } from '#src/classes/ircClientClass.js';

export abstract class IrcCommand {
  public abstract readonly banchoClient: BanchoClient;

  public abstract handleCommand(): void | Promise<void>;
}
