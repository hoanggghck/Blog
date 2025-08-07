export interface BaseResponse<T = any> {
    message?: string;
    result?: T;
}