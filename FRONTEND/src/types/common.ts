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

export interface FilterState {
  page: number;
  limit: number;
  keyword: string;
  category_id: number;
};

export type FilterAction =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'APPLY_KEYWORD'; payload: { keyword: string } }
  | { type: 'APPLY_CAT'; payload: { cat: number } }
  | { type: 'RESET' };
