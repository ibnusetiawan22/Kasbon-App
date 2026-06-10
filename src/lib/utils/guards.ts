export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${String(value)}`);
};
