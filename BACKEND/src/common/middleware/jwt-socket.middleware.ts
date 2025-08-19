import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class JwtSocketMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(socket: Socket, next: (err?: any) => void) {
    try {
      const token = socket.handshake?.auth?.token || socket.handshake?.query?.token;

      if (!token) throw new UnauthorizedException('Thiếu token');

      const payload = await this.jwtService.verifyAsync(token as string);

      socket.data.user = {
        id: payload.sub,
        email: payload.email,
      };

      next();
    } catch (err) {
      next(new UnauthorizedException('Invalid or expired token'));
    }
  }
}
