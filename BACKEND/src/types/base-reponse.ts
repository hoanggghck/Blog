export type BaseResponseType<T> = {
  code?: number;
  message: string;
  result: T;
}
