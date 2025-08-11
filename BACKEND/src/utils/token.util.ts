import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const jwtService = new JwtService();

export const generateTokens = async (
    user: {id: number, name: string},
    refreshTokenExpiresIn: string = '',
) => {
    const payload = { sub: user.id, username: user.name };
    const accessToken = jwtService.sign(payload, { expiresIn: '60m' });
    const refreshToken = jwtService.sign(payload, { expiresIn: refreshTokenExpiresIn ?? '30d' });
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return { accessToken, refreshToken, refreshTokenExpiresAt, refreshTokenHash };
}
