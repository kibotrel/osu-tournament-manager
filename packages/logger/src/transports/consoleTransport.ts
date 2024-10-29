import { format, transports } from 'winston';

import {
  baseConsoleFormat,
  consoleSerializeAndPrint,
} from '#src/formats/consoleFormats.js';

const { combine } = format;

export const consoleTransport = () => {
  return new transports.Console({
    handleRejections: true,
    handleExceptions: true,
    format: combine(...baseConsoleFormat, consoleSerializeAndPrint),
  });
};
