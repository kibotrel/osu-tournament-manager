import { format, transports } from 'winston';

import {
  baseConsoleFormat,
  consoleSerializeAndPrint,
} from '#src/formats/consoleFormats.js';

const { combine } = format;

export const consoleTransport = () => {
  return new transports.Console({
    format: combine(...baseConsoleFormat, consoleSerializeAndPrint),
    handleExceptions: true,
    handleRejections: true,
  });
};
