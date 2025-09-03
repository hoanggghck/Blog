import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';

import { LoginDto } from './dto/login.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { generateTokens } from 'src/utils/token.util';
import { Token } from 'src/modules/token/entities/token.entity';
import { checkRefreshTokenValid } from 'src/utils/checkAuthen';
import { Role } from 'src/modules/role/entities/role.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Token)
        private readonly tokenRepo: Repository<Token>,

        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,

        private readonly httpService: HttpService,

        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });

        if (existingUser) throw new ConflictException('Email đã tồn tại');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        // Lấy role mặc định "user" (có thể null)
        // let roleToAssign: Role | null = null;

        // if (dto?.role) {
        //     roleToAssign = await this.roleRepo.findOne({ where: { id: dto.role } });
        // }

        // if (!roleToAssign) {
        //     roleToAssign = await this.roleRepo.findOne({ where: { name: 'user' } });

        //     if (!roleToAssign) {
        //         roleToAssign = null
        //     }
        // }
        const user = this.userRepo.create({
          name: dto.username,
          email: dto.email,
          passwordHash
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
        if (!user) throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không hợp lệ');

        if (!user.passwordHash) {
            throw new UnauthorizedException('Yêu cầu có mật khẩu');
        }

        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không hợp lệ');

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
        const token = await checkRefreshTokenValid(this.jwtService, accessToken, refreshToken, this.tokenRepo);
        const decoded = this.jwtService.decode(accessToken);
        if(!decoded.sub) throw new UnauthorizedException('Token không hợp lệ')
        const { accessToken: newAT, refreshToken: newRT, refreshTokenHash} = await generateTokens({ id: decoded.sub, name: decoded.username}, this.jwtService, token.refreshTokenExpiresAt.toString());
        await this.tokenRepo.update(
            { userId: decoded?.sub },
            {
                refreshTokenHash,
                usedTokens: [...(token.usedTokens || []), token.refreshTokenHash]
            }
        );
        return { accessToken: newAT, refreshToken: newRT };
    }

    async logout(accessToken: string) {
        const decoded = await this.jwtService.decode(accessToken);
        if (!decoded.sub) throw new UnauthorizedException('Không tìm thấy người dùng này');
        const tokenRecord = await this.tokenRepo.findOne({ where: { userId: decoded.sub } });
        if (!tokenRecord) {
            throw new UnauthorizedException('Không tìm thấy người dùng này');
        }
        await this.tokenRepo.delete({ userId: tokenRecord.userId });
        return true;
    }

    async googleLoginWithAccessToken(accessToken: string) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
                })
            );

            let user = await this.userRepo.findOne({ where: { email: data.email } });
            if (!user) {
                user = this.userRepo.create({
                email: data.email,
                name: data.name,
                avatarUrl: data.picture,
                passwordHash: null,
                });
                await this.userRepo.save(user);
            }

            await this.tokenRepo.delete({ userId: user.id });
            const { accessToken: at, refreshToken, refreshTokenHash, refreshTokenExpiresAt } = await generateTokens(user, this.jwtService);

            await this.tokenRepo.save({
                userId: user.id,
                refreshTokenHash,
                refreshTokenExpiresAt,
            });

            return { accessToken: at, refreshToken };
        } catch (err) {
            throw new UnauthorizedException('Google access token không hợp lệ hoặc đã hết hạn');
        }
      }
}
