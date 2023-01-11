import { ResultAsync } from 'neverthrow';

export enum DbErrorType {
  NotFound,
  Other,
}

export type DbError =
  | { type: DbErrorType.NotFound; message?: string }
  | { type: DbErrorType.Other; error?: Error | unknown };

export const NotFoundError = (message = ''): DbError => ({
  type: DbErrorType.NotFound,
  message,
});

export const OtherError = (error?: Error | unknown): DbError => ({
  type: DbErrorType.Other,
  error,
});

export type DbResult<T> = ResultAsync<T, DbError>;
