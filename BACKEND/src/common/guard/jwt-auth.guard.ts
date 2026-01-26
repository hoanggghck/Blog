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
            return true;
        }

        const request = context.switchToHttp().getRequest();
        let accessToken = request.headers['authorization'];
        const refreshToken = request.headers['refreshtoken'];
        if (accessToken && accessToken.startsWith('Bearer ')) {
            accessToken = accessToken.split(' ')[1];
        }
        
        if (
            typeof accessToken !== "string" ||
            accessToken === '' ||
            accessToken === 'null'
        ) {
            throw new UnauthorizedException('Token không hợp lệ');
        }
        
        const token = await checkRefreshTokenValid(this.jwtService, accessToken, refreshToken, this.tokenRepo);
        await checkAccessTokenExpired(this.jwtService, accessToken, request);
        if (token) request.userId = token.userId;
        return true;
    }
}
