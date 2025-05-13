import type { ErrorReport } from '#src/sharedExport.js';

export const isBinaryObject = (object: unknown): object is Blob => {
  return (
    typeof object === 'object' &&
    Object.prototype.toString.call(object) === '[object Blob]'
  );
};

export const isErrorReport = (input: unknown): input is ErrorReport => {
  return (
    typeof input === 'object' &&
    input !== null &&
    'instance' in input &&
    'status' in input &&
    'title' in input
  );
};
