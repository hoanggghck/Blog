export class BaseResponse {
  protected success<T>({ code, message, result }: BaseResponseType<T>): BaseResponseType<T> {
    return { code, message, result };
  }
}

export type BaseResponseType<T> = {
  code: number;
  message: string;
  result: T;
}
