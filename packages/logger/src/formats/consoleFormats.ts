import { inspect } from 'node:util';

import chalk from 'chalk';
import type { Logform } from 'winston';
import { format } from 'winston';

import type { LogMetadata } from '#src/loggerExport.js';

const { colorize, json, printf, timestamp } = format;

export const baseConsoleFormat: Logform.Format[] = [
  colorize(),
  json(),
  timestamp(),
];

interface FormatErrorParameters {
  error: Error;
  logMessage?: string;
  logParts: string[];
  nestingLevel: number;
}

const formatError = (options: FormatErrorParameters) => {
  const { error, logMessage, logParts, nestingLevel } = options;
  const [errorName, ...stackLines] = error.stack!.split('\n');

  if (logMessage !== error.message) {
    logParts.push(`${' '.repeat(2 * nestingLevel)}${errorName}`);
  }

  logParts.push(
    ...stackLines.map((line) => {
      return chalk.grey(
        `${' '.repeat(2 * nestingLevel)}${line
          .replace(/ +/, '')
          .replace(/\(\/osu-tournanament-manager\//, '(')}`,
      );
    }),
  );

  if (error.cause) {
    formatError({
      error: error.cause as Error,
      logParts,
      nestingLevel: nestingLevel + 1,
    });
  }
};

interface FormatAdditionalDataParameters {
  data: Record<string, unknown>;
  hasError: boolean;
  logParts: string[];
}

const formatAdditionalData = (options: FormatAdditionalDataParameters) => {
  const { data, hasError, logParts } = options;
  const colorizedData = inspect(data, { colors: true })
    .replace(/^{/, '')
    .replace(/}$/, '')
    .split('\n')
    .filter(Boolean)
    .join('\n');
  const dataParts = [colorizedData];

  if (hasError) {
    dataParts.unshift('');
  }

  logParts.push(...dataParts);
};

export const consoleSerializeAndPrint = printf((data) => {
  const { timestamp, level, message } = data;
  const splat = Array.isArray(data[Symbol.for('splat')])
    ? (data[Symbol.for('splat')] as LogMetadata[])
    : [];
  const metadata = splat.at(0) || {};
  const { error, ...rest }: LogMetadata = metadata;
  const formattedTimestamp = `[${chalk.magenta(timestamp)}]`;
  const logParts: string[] = [`${formattedTimestamp} ${level}: ${message}`];

  if (error) {
    formatError({
      error,
      logParts,
      logMessage: message as string,
      nestingLevel: 1,
    });
  }

  if (Object.keys(rest).length > 0) {
    formatAdditionalData({
      data: rest,
      hasError: Boolean(error),
      logParts,
    });
  }

  return logParts.join('\n');
});
