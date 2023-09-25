export type MakeDbOptional<T> = T extends { db: infer U }
  ? Omit<T, "db"> & { db?: U }
  : T;
