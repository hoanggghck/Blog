import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

export const generateTokens = async (
    user: {id: number, name: string},
    jwtService: JwtService,
    refreshTokenExpiresIn: string = '',
) => {
    let refreshTokenExpiresAt: Date;
    if (refreshTokenExpiresIn) {
        const parsedDate = new Date(refreshTokenExpiresIn);
        if (isNaN(parsedDate.getTime())) {
            refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        } else {
            refreshTokenExpiresAt = parsedDate;
        }
    } else {
        refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    const expiresInSeconds = Math.floor((refreshTokenExpiresAt.getTime() - Date.now()) / 1000);
    const tokenSecret = randomUUID();
    const refreshTokenExpiresInCurrent = expiresInSeconds > 0 ? `${expiresInSeconds}s` : '30d';
    const payload = { sub: user.id, username: user.name, tokenSecret };

    const accessToken = jwtService.sign(payload, { expiresIn: '15s' });
    const refreshToken = jwtService.sign(payload, { expiresIn: refreshTokenExpiresInCurrent });
    const refreshTokenHash = await bcrypt.hash(tokenSecret , 10);
    return { accessToken, refreshToken, refreshTokenExpiresAt, refreshTokenHash };
}
