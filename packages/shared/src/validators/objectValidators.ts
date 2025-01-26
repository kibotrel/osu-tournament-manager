export const isBinaryObject = (object: unknown): object is Blob => {
  return (
    typeof object === 'object' &&
    Object.prototype.toString.call(object) === '[object Blob]'
  );
};
