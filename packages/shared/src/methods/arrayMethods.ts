/**
 * Format a list of elements into a string with a separator.
 */
export const formatList = (
  elements: string[],
  options?: {
    separator?: string;
    removeEmpty?: boolean;
  },
) => {
  const { removeEmpty = false, separator = ',' } = options ?? {};
  const filteredElements = removeEmpty ? elements.filter(Boolean) : elements;

  return filteredElements.join(separator);
};
