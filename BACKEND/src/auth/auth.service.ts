import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private jwtService: JwtService,
      ) {}    

    async register(dto: RegisterDto) {
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
        throw new ConflictException('Email already exists');
    }
    
    const passwordHash = await bcrypt.hash(dto.password, 10);
    
    const user = this.userRepo.create({
        name: dto.username,
        email: dto.email,
        passwordHash,
    });
    
    await this.userRepo.save(user);
    
    // Tạo payload và token như login
    const payload = { sub: user.id, username: user.name };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    // Lưu hash refresh token
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(user.id, { refreshTokenHash });
    
    return {
        message: 'User registered successfully',
        accessToken,
        refreshToken,
    };
    }

    async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { name: dto.username } });
    if (!user) {
        throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
    }

    // Tạo access token
    const payload = { sub: user.id, username: user.name };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Tạo refresh token (thường thời gian dài hơn)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Lưu hash refresh token vào DB để xác thực khi refresh
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(user.id, { refreshTokenHash });

    return {
        message: 'Login successful',
        accessToken,
        refreshToken,
    };
    }

   

    async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepo.findOneBy({id :userId});
    if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: user.id, username: user.name };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    await this.userRepo.update(user.id, { refreshTokenHash });

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
    }
}
