export default function (func: ((unknown: unknown) => unknown), delay: number, ...args: unknown[]) {
  let timer: number;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(args);
    }, delay)
  }
}
