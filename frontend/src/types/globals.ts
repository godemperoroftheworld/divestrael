export type ArrayElement<T> = T extends Array<infer U> ? U : T;

type Prev = [never, 0, 1, 2, 3, 4, 5];
export type DeepKey<T, D extends number = 5> = [D] extends [never]
  ? never // Stop if depth is `never`
  : T extends object
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      T extends Function
      ? string
      : {
          [K in keyof T]-?: K extends string | number
            ?
                | `${K}`
                | (DeepKey<T[K], Prev[D]> extends never
                    ? never
                    : `${K}.${DeepKey<T[K], Prev[D]>}`)
            : never;
        }[keyof T]
    : never;
