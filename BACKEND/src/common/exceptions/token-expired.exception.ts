import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenExpiredException extends HttpException {
    constructor() {
        super('Access token expired', 433);
    }
}
