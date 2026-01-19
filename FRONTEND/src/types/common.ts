export interface ApiResponseType<T, D> {
  message: string;
  code: string;
  result: T;
  error: D;
};

export interface ApiResponseListType<T> {
  items: T[];
  page: number;
  total: number;
  limit: number;
}

export interface ApiResponseCreatedType {
  id: number;
}
