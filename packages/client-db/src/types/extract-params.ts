// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetParameters<T extends (...args: any) => unknown> = Omit<
  Parameters<T>[0],
  "db"
>;
