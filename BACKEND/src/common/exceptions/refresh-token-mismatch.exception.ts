import { HttpException, HttpStatus } from '@nestjs/common';

export class RefreshTokenMismatchException extends HttpException {
  constructor() {
    super('Refresh token mismatch', HttpStatus.UNAUTHORIZED);
  }
}
