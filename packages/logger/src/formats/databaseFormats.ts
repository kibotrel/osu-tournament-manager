import type { Logform } from 'winston';
import { format } from 'winston';

const { json, timestamp } = format;

export const baseDatabaseFormat: Logform.Format[] = [json(), timestamp()];
