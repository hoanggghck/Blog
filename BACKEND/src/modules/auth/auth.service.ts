import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { LoginDto } from './dto/login.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { generateTokens } from 'src/utils/token.util';
import { Token } from 'src/modules/token/entities/token.entity';
import { checkRefreshTokenValid } from 'src/utils/checkAuthen';
import { Role } from 'src/modules/role/entities/role.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Token)
        private readonly tokenRepo: Repository<Token>,

        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,

        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });

        if (existingUser) throw new ConflictException('Email already exists');
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
        const token = await checkRefreshTokenValid(this.jwtService, accessToken, refreshToken, this.tokenRepo);
        const decoded = this.jwtService.decode(refreshToken);

        if(!decoded) throw new UnauthorizedException('Token không hợp lệ')
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
        const { sub } = this.jwtService.decode(accessToken)

        const tokenRecord = await this.tokenRepo.findOne({ where: { userId: sub } });
        if (!tokenRecord) {
            throw new UnauthorizedException('No active session found');
        }
        await this.tokenRepo.delete({ userId: tokenRecord.userId });
        return true;
    }
}
