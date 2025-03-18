/**
 * Base entity interfaces for the application
 */

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimestampFields {
  createdAt: Date;
  updatedAt: Date;
}

export interface IdentifiableEntity {
  id: string;
}
