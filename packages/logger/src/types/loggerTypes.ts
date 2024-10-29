import type { HttpError } from '@packages/shared';

export enum LogLevel {
  Debug = 'debug',
  Error = 'error',
  Http = 'http',
  Info = 'info',
  Silly = 'silly',
  Verbose = 'verbose',
  Warn = 'warn',
}

export interface LogMetadata {
  requestId?: string;
  error?: HttpError;
  [key: string]: unknown;
}
