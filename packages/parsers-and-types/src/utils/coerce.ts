export function coerceNullToUndefined<T>(parser: (value: unknown) => T) {
  return (raw: unknown) => {
    if (raw === null || raw === undefined) {
      return undefined;
    }
    return parser(raw);
  };
}
