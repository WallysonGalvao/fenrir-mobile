/**
 * Extracts only the **non-function** properties from a given type `T`.
 *
 * Useful for deriving a "pure" initial state (without methods) for stores like Zustand.
 *
 * @example
 * type Store = {
 *   name: string;
 *   setName: (name: string) => void;
 * };
 *
 * // Result: { name: string }
 * type StateOnly = InitialStateOnly<Store>;
 *
 * @template T The source type to extract non-function properties from.
 */
export type InitialStateOnly<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends Function ? never : K;
  }[keyof T]
>;
