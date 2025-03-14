import type { transport as Transport, Logger as WinstonLogger } from 'winston';
import { createLogger } from 'winston';

import { consoleTransport } from '#src/transports/consoleTransport.js';
import type { LogLevel, LogMetadata } from '#src/types/loggerTypes.js';

const enum Events {
  FINISH = 'finish',
}

export interface LoggerOptions {
  isProductionMode: boolean;
  level: LogLevel;
}

/**
 * Wrapper around [`winston`](https://www.npmjs.com/package/winston) logger.
 */
export class Logger {
  public readonly winston: WinstonLogger;

  constructor(options: LoggerOptions) {
    const { isProductionMode, level } = options;
    const transports: Transport[] = [];

    if (!isProductionMode) {
      transports.push(consoleTransport());
    }

    this.winston = createLogger({
      exitOnError: false,
      level,
      transports,
    });
  }

  public debug(message: string, metadata?: LogMetadata) {
    return this.winston.debug(message, metadata);
  }

  /**
   * Gracefully ends the logger, waits for all transports to finish writing logs.
   */
  public async end() {
    await new Promise((resolve) => {
      this.winston.on(Events.FINISH, resolve);
      this.winston.end();
    });

    await Promise.all(
      this.winston.transports.map((transport) => {
        return new Promise((resolve) => {
          transport.on(Events.FINISH, resolve);
          transport.end();
        });
      }),
    );
  }

  public error(message: string, metadata?: LogMetadata) {
    return this.winston.error(message, metadata);
  }
  public http(message: string, metadata?: LogMetadata) {
    return this.winston.http(message, metadata);
  }
  public info(message: string, metadata?: LogMetadata) {
    return this.winston.info(message, metadata);
  }
  public silly(message: string, metadata?: LogMetadata) {
    return this.winston.silly(message, metadata);
  }
  public verbose(message: string, metadata?: LogMetadata) {
    return this.winston.verbose(message, metadata);
  }
  public warn(message: string, metadata?: LogMetadata) {
    return this.winston.warn(message, metadata);
  }
}
