import type { Observer } from "dexie";
import { liveQuery } from "dexie";

export const liveClientDbQuery = <T>({
  querier,
  ...observer
}: {
  querier: () => Promise<T> | T;
} & Observer<T>) => {
  const observable = liveQuery(querier);
  const subscription = observable.subscribe(observer);
  return subscription;
};
