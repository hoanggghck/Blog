import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
//
import { Token } from 'src/token/entities/token.entity';
import { generateTokens } from 'src/utils/token.util';
import { TokenExpiredException } from 'src/common/exceptions/token-expired.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly jwtService: JwtService,

        @InjectRepository(Token)
        private readonly tokenRepo: Repository<Token>,
    ) {
        super();
    }
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const publicPaths = ['/login', '/register'];

        const authHeader = request.headers['authorization'];
        if (!authHeader) {
          throw new UnauthorizedException('Missing authorization header');
        }
        if (publicPaths.includes(request.url)) {
            return true;
        }
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
          throw new UnauthorizedException('Invalid authorization header format');
        }

        try {
             const decoded = this.jwtService.decode(token) as { exp?: number };
            
            if (!decoded || !decoded.exp) {
                throw new UnauthorizedException('Invalid token');
            }

            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp < now) {
                throw new UnauthorizedException('Access token expired (manual check)');
            }
        
            this.jwtService.verify(token);
        
            return true;
        } catch (err) {
            if (err.message.includes('Access token expired')) {
                throw new TokenExpiredException();
            }
            
            throw new UnauthorizedException('Invalid access token');
        }
    }
}
