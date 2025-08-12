import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/entities/user.entity';
import { generateTokens } from 'src/utils/token.util';
import { Token } from 'src/token/entities/token.entity';
import { checkAuthen } from 'src/utils/checkAuthen';

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

    async refreshTokens(accessToken: string, refreshToken: string) {
        const { userId, username, checkRefreshTokenExpiresAt, role } = await checkAuthen(
            this.jwtService,
            accessToken,
            refreshToken,
            this.tokenRepo
          );
          
          let AT: string
          let RT: string

          if (checkRefreshTokenExpiresAt) {
            const { accessToken: newAT, refreshToken: newRT, refreshTokenHash } =
              await generateTokens(
                { id: userId, name: username, role: role },
                this.jwtService,
                checkRefreshTokenExpiresAt.toString()
              );
              AT = newAT
              RT = newRT
          
              const tokenRecord = await this.tokenRepo.findOne({ where: { userId } });
              if (tokenRecord) {
                await this.tokenRepo.update(
                  { userId },
                  {
                    refreshTokenHash,
                    usedTokens: [...(tokenRecord.usedTokens || []), refreshTokenHash]
                  }
                );
              }
          
          } else {
            await this.tokenRepo.delete({ userId: userId });
          
            const { accessToken: newAT, refreshToken: newRT, refreshTokenExpiresAt, refreshTokenHash } =
              await generateTokens(
                { id: userId, name: username, role: role },
                this.jwtService
              );
              AT = newAT
              RT = newRT

            await this.tokenRepo.save({
              userId,
              refreshToken: newRT,
              refreshTokenHash,
              refreshTokenExpiresAt,
              usedTokens: []
            });
        }
        return { accessToken: AT, refreshToken: RT };

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
