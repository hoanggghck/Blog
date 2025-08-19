export type ApiResponseType<T, D> = {
  message: string;
  code: string;
  result: T;
  error: D;
};

export type ApiResponseListType<T> = {
  items: T[];
  page: number;
  total: number;
  limit: number;
}