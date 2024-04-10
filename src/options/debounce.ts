export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
) => {
  let timeout: number | undefined;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};
