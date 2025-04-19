export type ArrayElement<T> = T extends Array<infer U> ? U : T;

export type DeepKey<T> = T extends object
  ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    T extends Function
    ? string
    : {
        [K in keyof T]-?: K extends string | number
          ? `${K}` | `${K}.${DeepKey<T[K]>}`
          : never;
      }[keyof T]
  : never;
