import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction } from "express";
import { Token } from "src/modules/token/entities/token.entity";
import { checkAccessTokenExpired, checkRefreshTokenValid } from "src/utils/checkAuthen";
import { Repository } from "typeorm";

@Injectable()
export class AuthenticaitonMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(Token)
        private readonly tokenRepo: Repository<Token>,
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {

        let accessToken = req.headers['authorization'] as string;
        const refreshToken = req.headers['refreshtoken'] as string;

        if (!accessToken || !refreshToken) {
            throw new UnauthorizedException('Thiếu token xác thực');
        }

        if (accessToken.startsWith('Bearer ')) {
            accessToken = accessToken.split(' ')[1];
        }

        await checkRefreshTokenValid(this.jwtService, accessToken, refreshToken, this.tokenRepo);
        await checkAccessTokenExpired(this.jwtService, accessToken, req);

        next();
    }
}
