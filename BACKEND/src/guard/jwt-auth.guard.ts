import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
import { Token } from 'src/token/entities/token.entity';
import { generateTokens } from 'src/utils/token.util';
//

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
    const accessToken = request.headers['authorization'];
    const currentRefreshToken = request.headers['refreshtoken'];

    const publicPaths = ['/auth/login', '/auth/register'];

    if (publicPaths.includes(request.url)) {
        return true;
    }

    if (!accessToken || !currentRefreshToken) {
        throw new UnauthorizedException('Access token or refresh token is missing');
    }
    const {sub, username, iat, exp } = this.jwtService.verify(accessToken);
    // console.log(decoded);
    const userToken = await this.tokenRepo.findOne({ where: { userId: sub} });
    if (!userToken) {
        throw new UnauthorizedException('User not found');
    }
    if (userToken.usedTokens.includes(currentRefreshToken) || currentRefreshToken !== userToken.refreshTokenHash) {
        await this.tokenRepo.delete({ userId: sub });
        throw new UnauthorizedException('Refresh token has already been used');
    }
    if (userToken.refreshTokenExpiresAt < new Date()) {
        await this.tokenRepo.delete({ userId: sub });
        throw new UnauthorizedException('Refresh token has expired');
    }
    if (exp < Math.floor(Date.now() / 1000)) {
        userToken.usedTokens.push(currentRefreshToken);
        const { accessToken, refreshToken, refreshTokenHash, refreshTokenExpiresAt } = await generateTokens( { id: sub, name: username }, userToken.refreshTokenExpiresAt.toISOString());

        await this.tokenRepo.save({
            accessToken,
            refreshToken,
            userId: sub,
            refreshTokenHash,
            refreshTokenExpiresAt,
            usedTokens: userToken.usedTokens,
        });
    }
    return true;
  }
}
