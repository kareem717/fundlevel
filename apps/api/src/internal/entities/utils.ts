/**
 * Utility type that omits common entity fields (id and timestamps)
 */
export type OmitEntityFields<
  T extends {
    id?: number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
  },
> = OmitTimestampFields<Omit<T, "id">>;

export type OmitTimestampFields<
  T extends {
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
  },
> = Omit<T, "createdAt" | "updatedAt">;
