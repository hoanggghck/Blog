import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
//
import { Token } from 'src/modules/token/entities/token.entity';
import { checkAccessTokenExpired, checkRefreshTokenValid } from 'src/utils/checkAuthen';
import { GLOBAL_PUBLIC_ROUTES } from '../constant/public-routes.constant';

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

        if (GLOBAL_PUBLIC_ROUTES.some(path => request.url.startsWith(path))) {
            return true;
        }
        let accessToken = request.headers['authorization'];
        const refreshToken = request.headers['refreshtoken'];
        if(!accessToken) {
            throw new UnauthorizedException('Token không hợp lệ');
        }
        if (accessToken.startsWith('Bearer ')) {
            accessToken = accessToken.split(' ')[1];
        }
        await checkRefreshTokenValid(this.jwtService, accessToken, refreshToken, this.tokenRepo);
        await checkAccessTokenExpired(this.jwtService, accessToken, request);
        return true;
    }
}
