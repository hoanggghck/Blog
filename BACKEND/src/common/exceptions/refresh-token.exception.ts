import { HttpException, HttpStatus } from '@nestjs/common';

export class RefreshTokenMismatchException extends HttpException {
  constructor() {
    super('Phát hiện dữ liệu bị rò rĩ, vui lòng đăng nhập lại', HttpStatus.UNAUTHORIZED);
  }
}

export class RefreshTokenExpriredException extends HttpException {
  constructor() {
    super('Token hết hạn', HttpStatus.UNAUTHORIZED);
  }
}
