import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Token } from 'src/auth/entities/token.entity';

export async function generateTokensAndSave(
  user: User,
  jwtService: JwtService,
  tokenRepo: Repository<Token>,
) {
  const payload = { sub: user.id, username: user.name };

  const accessToken = jwtService.sign(payload, { expiresIn: '15m' });

  const refreshToken = jwtService.sign(payload, { expiresIn: '7d' });

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  await tokenRepo.save({
    userId: user.id,
    refreshTokenHash,
    refreshTokenExpiresAt: refreshTokenExpiresAt, // 7 ngày
    usedTokens: [],
  });

  return { accessToken, refreshToken, refreshTokenExpiresAt };
}
