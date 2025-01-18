import { randomUUID } from 'node:crypto';

import type { Client } from 'pg';
import type { Logform } from 'winston';
import Transport from 'winston-transport';

import type { LogMetadata } from '#src/loggerExport.js';

interface FormatErrorParameters {
  error: Error;
  logMessage?: string;
  stackTrace: string[];
  nestingLevel: number;
}

interface DatabaseTransportOptions extends Transport.TransportStreamOptions {
  databaseClient: Client;
}

export class DatabaseTransport extends Transport {
  private databaseClient: Client;

  constructor(options: DatabaseTransportOptions) {
    super(options);

    this.databaseClient = options.databaseClient;
  }

  override async log(data: Logform.TransformableInfo, next: () => void) {
    const { level, message, timestamp } = data;
    const splat = Array.isArray(data[Symbol.for('splat')])
      ? data[Symbol.for('splat')]
      : [];
    const metadata: LogMetadata = splat.at(0) || {};
    const { error, requestId, ...restMetadata } = metadata;
    const stackTrace: string[] = [];

    if (error) {
      this.formatError({
        error,
        logMessage: message,
        stackTrace,
        nestingLevel: 1,
      });
    }

    try {
      await this.databaseClient.query(
        `
        INSERT INTO "analytics"."serverLogs" (
          "level",
          "message",
          "metadata",
          "requestId",
          "timestamp"
        )
        VALUES ($1, $2, $3, $4, $5)
     `,
        [
          level,
          message,
          JSON.stringify(restMetadata),
          requestId ?? randomUUID(),
          timestamp,
        ],
      );
    } catch {}

    next();
  }

  private formatError(options: FormatErrorParameters) {
    const { error, logMessage, stackTrace, nestingLevel } = options;
    const [errorName, ...stackLines] = error.stack!.split('\n');

    if (logMessage !== error.message) {
      stackTrace.push(`${' '.repeat(2 * (nestingLevel - 1))}${errorName}`);
    }

    stackTrace.push(
      ...stackLines.map((line) => {
        return `${' '.repeat(2 * nestingLevel)}${line
          .replace(/ +/, '')
          .replace(/\(\/osu-tournanament-manager\//, '(')}`;
      }),
    );

    if (error.cause) {
      this.formatError({
        error: error.cause as Error,
        stackTrace,
        nestingLevel: nestingLevel + 1,
      });
    }
  }
}
