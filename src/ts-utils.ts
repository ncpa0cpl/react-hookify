type ReWrap<O> = {
  [K in keyof O]: O[K];
};

type _Inverse<O> = {
  [K in keyof O]-?: undefined extends O[K]
    ? Exclude<O[K], undefined>
    : O[K] | undefined;
};

type KeysOfOptionals<O> = Exclude<
  {
    [K in keyof O]: undefined extends O[K] ? K : undefined;
  }[keyof O],
  undefined
>;

export type Inverse<O> = ReWrap<
  Omit<_Inverse<O>, KeysOfOptionals<_Inverse<O>>> & {
    [K in keyof Pick<_Inverse<O>, KeysOfOptionals<_Inverse<O>>>]?: Pick<
      _Inverse<O>,
      KeysOfOptionals<_Inverse<O>>
    >[K];
  }
>;
