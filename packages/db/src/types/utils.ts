type TimeStampFields = {
  createdAt: string | Date;
  updatedAt: string | Date | null;
};

type EntityFields = TimeStampFields & {
  id: string | number;
};

export type OmitTimeStampFields<T extends Partial<TimeStampFields>> = Omit<
  T,
  "createdAt" | "updatedAt"
>;
export type OmitEntityFields<T extends Partial<EntityFields>> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;
