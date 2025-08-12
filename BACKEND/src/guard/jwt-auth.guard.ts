import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
//
import { Token } from 'src/token/entities/token.entity';
import { checkAuthen } from 'src/utils/checkAuthen';

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

        const accessToken = request.headers['authorization'];
        const refreshToken = request.headers['refreshtoken'];
        await checkAuthen(this.jwtService, accessToken, refreshToken, this.tokenRepo);

        return true;
    }
}
