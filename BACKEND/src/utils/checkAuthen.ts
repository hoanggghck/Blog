import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RefreshTokenMismatchException } from 'src/common/exceptions/refresh-token-mismatch.exception';
import { TokenExpiredException } from 'src/common/exceptions/token-expired.exception';

export async function checkAuthen(
    jwtService: JwtService,
    accessToken: string,
    refreshToken?: string, // để optional
    tokenRepo?: any
  ) {
    if (!accessToken) {
      throw new UnauthorizedException('Missing access token');
    }
    if (accessToken.startsWith('Bearer ')) {
        accessToken = accessToken.split(' ')[1];
    } 

    let decoded;
    try {
      decoded = jwtService.decode(accessToken) as any;
    } catch {
      throw new UnauthorizedException('Invalid token format');
    }
  
    const userId = decoded.sub;
    const username = decoded.username;
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }
    let checkRefreshTokenExpiresAt: Date | null = null;
    if (refreshToken) {
        if (!tokenRepo) {
            throw new UnauthorizedException('Token repository is required for refresh token check');
        }

        // Check trong DB
        const dbToken = await tokenRepo.findOne({ where: { userId } });
        if (!dbToken) {
            throw new UnauthorizedException('User logged out');
        }

        let isUsedBefore = false;
        for (const usedTokenHash of dbToken.usedTokens || []) {
            const matchUsed = await bcrypt.compare(refreshToken, usedTokenHash);
            if (matchUsed) {
                isUsedBefore = true;
                break;
            }
        }

        if (isUsedBefore) {
            throw new UnauthorizedException('Refresh token already used');
        }

        // Check refresh token mismatch
        const isMatch = await bcrypt.compare(refreshToken, dbToken.refreshTokenHash);
        if (!isMatch) {
            throw new RefreshTokenMismatchException();
        }
        // Lấy thời hạn refresh token
        if (dbToken.refreshTokenExpiresAt && new Date(dbToken.refreshTokenExpiresAt) > new Date()) {
            checkRefreshTokenExpiresAt = dbToken.refreshTokenExpiresAt;
        }
    }

    try {
        jwtService.verify(accessToken);
        // AT hợp lệ → return luôn
        return { userId, username, checkRefreshTokenExpiresAt };
    } catch (err) {
        if (err.name === 'TokenExpiredError') {

        if (refreshToken && checkRefreshTokenExpiresAt) {
            return { userId, username, checkRefreshTokenExpiresAt };
        }
            // Còn lại → báo lỗi hết hạn
            throw new TokenExpiredException();
        }
            throw new UnauthorizedException('Invalid access token');
        }
  }
  
