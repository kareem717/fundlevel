/**
 * Utility type that omits common entity fields (id and timestamps)
 */
export type OmitEntityFields<
  T extends {
    id?: number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
  },
> = Omit<T, "id" | "createdAt" | "updatedAt">;
