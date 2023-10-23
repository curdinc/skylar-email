// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetParameters<T extends (...args: any) => unknown> =
  Parameters<T>[0];
