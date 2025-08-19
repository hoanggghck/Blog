import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
//
import { Token } from 'src/modules/token/entities/token.entity';
import { checkAccessTokenExpired, checkRefreshTokenValid } from 'src/utils/checkAuthen';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector,

        private readonly jwtService: JwtService,

        @InjectRepository(Token)
        private readonly tokenRepo: Repository<Token>,
    ) {
        super();
    }
    async canActivate(context: ExecutionContext) {

        const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true; // skip token check
        }

        const request = context.switchToHttp().getRequest();

        const publicPaths = ['/login', '/register'];
        if (publicPaths.includes(request.url)) {
            return true;
        }
        let accessToken = request.headers['authorization'];
        const refreshToken = request.headers['refreshtoken'];
        if (accessToken && accessToken.startsWith('Bearer ')) {
            accessToken = accessToken.split(' ')[1]; // lấy phần token sau Bearer
        }
        if (!accessToken) {
            throw new UnauthorizedException('Token không hợp lệ');
        }
        await checkRefreshTokenValid(this.jwtService, accessToken, refreshToken, this.tokenRepo);
        await checkAccessTokenExpired(this.jwtService, accessToken, request);
        return true;
    }
}
