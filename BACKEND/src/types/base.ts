export class BaseResponse {
protected success<T>(code: number, message: string, data: T): BaseResponseType<T> {
  return {
    code: code,
    message: message,
    result: data
  }
}
}

export type BaseResponseType<T> = {
  code: number;
  message: string;
  result: T;
}
