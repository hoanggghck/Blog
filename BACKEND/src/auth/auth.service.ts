import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { generateTokens } from 'src/utils/token.util';
import { Token } from 'src/token/entities/token.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Token)
        private readonly tokenRepo: Repository<Token>,

        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });

        if (existingUser) throw new ConflictException('Email already exists');
        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = this.userRepo.create({
          name: dto.username,
          email: dto.email,
          passwordHash,
        });
        await this.userRepo.save(user);

        // Generate mới
        const { accessToken, refreshToken, refreshTokenHash, refreshTokenExpiresAt } = await generateTokens(user, this.jwtService);

        await this.tokenRepo.save({
          userId: user.id,
          refreshTokenHash,
          refreshTokenExpiresAt,
        });

        return {
          accessToken,
          refreshToken
        }
    }

    async login(dto: LoginDto) {
        const user = await this.userRepo.findOne({ where: { name: dto.username } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) throw new UnauthorizedException('Invalid credentials');

        await this.tokenRepo.delete({ userId: user.id });

        const { accessToken, refreshToken, refreshTokenHash, refreshTokenExpiresAt } = await generateTokens(user, this.jwtService);

        await this.tokenRepo.save({
          userId: user.id,
          refreshTokenHash,
          refreshTokenExpiresAt,
        });

        return {
          accessToken,
          refreshToken,
        };
    }

    async refreshTokens(refreshToken: string) {
        if (!refreshToken) throw new UnauthorizedException('Refresh token missing');
      
        const payload = this.jwtService.decode(refreshToken) as { sub: number; username: string };
        if (!payload?.sub) {
            throw new UnauthorizedException('Invalid refresh token');
        } 
      
        const userToken = await this.tokenRepo.findOne({ where: { userId: payload.sub } });
        if (!userToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        if (userToken.refreshTokenExpiresAt < new Date()) {
            await this.tokenRepo.delete({ userId: payload.sub });
            throw new UnauthorizedException('Refresh token expired');
        }
      
        const usedTokens = userToken.usedTokens || [];
        const isReplay = await Promise.all(
            usedTokens.map(async (used) => await bcrypt.compare(refreshToken, used)),
        ).then(results => results.includes(true));
      
        if (isReplay) {
            await this.tokenRepo.delete({ userId: payload.sub });
            throw new UnauthorizedException('Refresh token already used');
        }
      
        const isValidRefreshToken = await bcrypt.compare(refreshToken, userToken.refreshTokenHash);
        if (!isValidRefreshToken) throw new UnauthorizedException('Invalid refresh token');
      
        const { accessToken, refreshToken: newRefreshToken, refreshTokenHash, refreshTokenExpiresAt } =
            await generateTokens({ id: payload.sub, name: payload.username }, this.jwtService, userToken.refreshTokenExpiresAt.toISOString());
      
        if (!userToken.usedTokens) {
            userToken.usedTokens = [];
        }

        userToken.usedTokens.push(await bcrypt.hash(refreshToken, 10));
        userToken.refreshTokenHash = refreshTokenHash;
        userToken.refreshTokenExpiresAt = refreshTokenExpiresAt;
      
        await this.tokenRepo.save(userToken);
      
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
      }

    async logout(userId: number) {
        const tokenRecord = await this.tokenRepo.findOne({ where: { userId } });
        if (!tokenRecord) {
            throw new UnauthorizedException('No active session found');
        }

        await this.tokenRepo.delete({ userId });
        return true;
    }
}
