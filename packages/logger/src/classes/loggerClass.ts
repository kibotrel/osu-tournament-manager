import type { Client } from 'pg';
import type { transport as Transport, Logger as WinstonLogger } from 'winston';
import { createLogger } from 'winston';

import { consoleTransport } from '#src/transports/consoleTransport.js';
import { databaseTransport } from '#src/transports/databaseTransport.js';
import type { LogLevel, LogMetadata } from '#src/types/loggerTypes.js';

export interface LoggerOptions {
  databaseClient?: Client;
  isProductionMode: boolean;
  level: LogLevel;
}

/**
 * Wrapper around [`winston`](https://www.npmjs.com/package/winston) logger.
 */
export class Logger {
  public readonly winston: WinstonLogger;

  constructor(options: LoggerOptions) {
    const { databaseClient, isProductionMode, level } = options;
    const transports: Transport[] = [];

    if (databaseClient) {
      transports.push(databaseTransport(databaseClient));
    }

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
