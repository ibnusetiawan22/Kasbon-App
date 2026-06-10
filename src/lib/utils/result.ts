export type Result<T, E = Error> =
  | {
      data: T;
      ok: true;
    }
  | {
      error: E;
      ok: false;
    };

export const ok = <T>(data: T): Result<T> => ({
  data,
  ok: true,
});

export const err = <E>(error: E): Result<never, E> => ({
  error,
  ok: false,
});
