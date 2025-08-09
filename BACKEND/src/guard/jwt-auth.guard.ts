import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const publicPaths = ['/auth/login', '/auth/register'];

    if (publicPaths.includes(request.url)) {
      return true; // Bỏ qua auth cho các đường dẫn này
    }

    return super.canActivate(context);
  }
}
