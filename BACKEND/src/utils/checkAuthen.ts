import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { RefreshTokenExpriredException, RefreshTokenMismatchException } from 'src/common/exceptions/refresh-token.exception';
import { TokenExpiredException } from 'src/common/exceptions/token-expired.exception';
import { Token } from 'src/modules/token/entities/token.entity';

export const checkRefreshTokenValid = async (
    jwtService: JwtService,
    accessToken: string,
    refreshToken: string,
    tokenRepo: Repository<Token>
  ) => {

    if (!accessToken && !refreshToken) {
        throw new UnauthorizedException('Token không hợp lệ');
    }

    const decoded = jwtService.decode(refreshToken);
    if (!decoded?.sub || !decoded?.tokenSecret) throw new UnauthorizedException('Token không hợp lệ');
    const tokenFound = await tokenRepo.findOne({ where: { userId: decoded.sub } })
    if (!tokenFound) throw new UnauthorizedException('Người dùng không tồn tại!!')

    let isUsedBefore = false;

    for (const usedTokenHash of tokenFound.usedTokens || []) {
        const matchUsed = await bcrypt.compare(decoded.tokenSecret, usedTokenHash);
        if (matchUsed) {
            isUsedBefore = true;
            break;
        }
    }

    if (isUsedBefore) {
      await tokenRepo.delete({ userId: tokenFound.userId })
      throw new RefreshTokenMismatchException()
    }

    const isMatch = await bcrypt.compare(decoded.tokenSecret, tokenFound.refreshTokenHash);
    if (!isMatch) {
        throw new UnauthorizedException('Token không hợp lệ');
    }
    const now = new Date();
    if (tokenFound.refreshTokenExpiresAt && tokenFound.refreshTokenExpiresAt < now) {
        await tokenRepo.delete({ userId: tokenFound.userId });
        throw new RefreshTokenExpriredException()
    }

    return tokenFound
}

export const checkAccessTokenExpired = async (
    jwtService: JwtService,
    accessToken: string,
    req?: any
) => {

    try {
        const payload = jwtService.verify(accessToken);
        if(req) {
            req.user = payload;
        }
        return payload;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new TokenExpiredException();
        }
    }
}

