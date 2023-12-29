import { createStore } from "jotai";

export const SkylarClientStore = createStore();
export const debounce = <T>(fn: (args: T) => void, delayInMs: number) => {
  let timeoutId: NodeJS.Timeout | undefined;
  return (args: T) => {
    if (!timeoutId) {
      fn(args);
    }
    timeoutId = setTimeout(() => {
      fn(args);
      clearTimeout(timeoutId);
    }, delayInMs);
  };
};
