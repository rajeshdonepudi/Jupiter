type AnyFunction = (...args: any[]) => any;

function debounce<T extends AnyFunction>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<T>): void {
    const context = this;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export default {
  debounce,
};
