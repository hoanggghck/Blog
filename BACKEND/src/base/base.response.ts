import type { BaseResponseType } from "src/types/base-reponse";

export class BaseResponse {
    protected success<T>({ code, message, result }: BaseResponseType<T>): BaseResponseType<T> {
        return { code, message, result };
    }
}
