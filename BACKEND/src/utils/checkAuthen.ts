import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RefreshTokenMismatchException } from 'src/common/exceptions/refresh-token-mismatch.exception';
import { TokenExpiredException } from 'src/common/exceptions/token-expired.exception';
import { Token } from 'src/token/entities/token.entity';
import { Repository } from 'typeorm';

export const checkRefreshTokenValid = async (
    jwtService: JwtService,
    accessToken: string,
    refreshToken: string,
    tokenRepo: Repository<Token>
  ) => {
    if (!accessToken && !refreshToken) {
        throw new UnauthorizedException('Token không hợp lệ');
    }
    if (accessToken.startsWith('Bearer ')) {
        accessToken = accessToken.split(' ')[1];
    }

    const { sub } = jwtService.decode(accessToken);
    const tokenFound = await tokenRepo.findOne({ where: { userId: sub } })
    if (!tokenFound) throw new UnauthorizedException('Người dùng không tồn tại!!')
    let isUsedBefore = false;
    for (const usedTokenHash of tokenFound.usedTokens || []) {
        const matchUsed = await bcrypt.compare(refreshToken, usedTokenHash);
        if (matchUsed) {
            isUsedBefore = true;
            break;
        }
    }
    if (isUsedBefore) {
        await tokenRepo.delete({ userId: tokenFound.userId })
        throw new RefreshTokenMismatchException()
    }
    const isMatch = await bcrypt.compare(refreshToken, tokenFound.refreshTokenHash);
    if (!isMatch) {
        throw new UnauthorizedException('Token không hợp lệ');
    }

    return tokenFound
}

export const checkAccessTokenExpired = async (
    jwtService: JwtService,
    accessToken: string,
) => {
    try {
      jwtService.verify(accessToken);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new TokenExpiredException();
      }
    }
}
  
