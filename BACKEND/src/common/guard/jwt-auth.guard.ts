import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
//
import { Token } from 'src/token/entities/token.entity';
import { checkAccessTokenExpired, checkRefreshTokenValid } from 'src/utils/checkAuthen';

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
        
        // const can = await super.canActivate(context);
        // if (!can) return false;
        
        const request = context.switchToHttp().getRequest();

        const publicPaths = ['/login', '/register'];
        if (publicPaths.includes(request.url)) {
            return true;
        }
        let accessToken = request.headers['authorization'];
        const refreshToken = request.headers['refreshtoken'];
        if (accessToken.startsWith('Bearer ')) {
            accessToken = accessToken.split(' ')[1];
        }
        await checkRefreshTokenValid(this.jwtService, accessToken, refreshToken, this.tokenRepo);
        await checkAccessTokenExpired(this.jwtService, accessToken)
        return true;
    }
}
