export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, milliseconds > 0 ? milliseconds : 0);
  });
};
