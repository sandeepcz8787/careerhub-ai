/**
 * Common utility types used across the entire platform.
 * Imported by both frontend and backend — keep this dependency-free.
 */

/** Branded type for MongoDB ObjectId strings */
export type ObjectId = string & { readonly __brand: 'ObjectId' };

/** ISO 8601 datetime string */
export type ISODateString = string & { readonly __brand: 'ISODateString' };

/** Nullable wrapper */
export type Nullable<T> = T | null;

/** Optional wrapper */
export type Maybe<T> = T | null | undefined;

/** Make specific keys required */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Make specific keys optional */
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Deep partial */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Record with string keys */
export type StringRecord<V = unknown> = Record<string, V>;

/** Pagination parameters */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Base entity fields all documents share */
export interface BaseEntity {
  id: ObjectId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Environment types */
export type AppEnvironment = 'development' | 'staging' | 'production' | 'test';

/** File upload metadata */
export interface FileMetadata {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  publicId?: string; // Cloudinary public ID
}
