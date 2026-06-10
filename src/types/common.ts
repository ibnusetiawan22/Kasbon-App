export type Id = string;
export type Nullable<T> = T | null;
export type Timestamp = string;

export interface WithTimestamps {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WithSoftDelete {
  deletedAt: Timestamp | null;
}
