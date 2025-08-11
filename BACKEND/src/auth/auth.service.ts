import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { generateTokensAndSave } from 'src/utils/token.util';
import { Token } from './entities/token.entity';

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
      
        // Kiểm tra token đã tồn tại chưa
        let tokenRecord = await this.tokenRepo.findOne({ where: { userId: user.id } });
      
        if (tokenRecord && tokenRecord.refreshTokenExpiresAt > new Date()) {
          // Token cũ vẫn còn hạn
          return {
            message: 'User registered successfully',
            accessToken: null, // Nếu muốn có AT mới thì vẫn có thể generate
            refreshToken: null,
          };
        }
      
        // Generate token mới
        const { accessToken, refreshToken, refreshTokenExpiresAt } =
          await generateTokensAndSave(user, this.jwtService, this.tokenRepo);
      
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
      
        await this.tokenRepo.save({
          userId: user.id,
          refreshTokenHash,
          refreshTokenExpiresAt: refreshTokenExpiresAt,
        });
      
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
      
        // Kiểm tra token đã tồn tại chưa
        let tokenRecord = await this.tokenRepo.findOne({ where: { userId: user.id } });
      
        if (tokenRecord && tokenRecord.refreshTokenExpiresAt > new Date()) {
          // Token cũ vẫn còn hạn → có thể generate AT mới nhưng giữ nguyên RT
          return {
            message: 'Login successful',
            accessToken: this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' }),
            refreshToken: null, // giữ nguyên RT
          };
        }
      
        // Token mới
        const { accessToken, refreshToken, refreshTokenExpiresAt } =
          await generateTokensAndSave(user, this.jwtService, this.tokenRepo);
      
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
      
        await this.tokenRepo.save({
          userId: user.id,
          refreshTokenHash,
          refreshTokenExpiresAt: refreshTokenExpiresAt,
        });
      
        return {
          message: 'Login successful',
          accessToken,
          refreshToken,
        };
      }

    async refreshTokens(userId: number, refreshToken: string) {
        const tokenRecord = await this.tokenRepo.findOne({ where: { userId } });
        if (!tokenRecord || !tokenRecord.refreshTokenHash) {
          throw new UnauthorizedException('Invalid refresh token');
        }
      
        // 1. Check hết hạn RT
        if (tokenRecord.refreshTokenExpiresAt < new Date()) {
          await this.tokenRepo.delete({ id: tokenRecord.id });
          throw new UnauthorizedException('Refresh token expired, please log in again');
        }
      
        // 2. Check token đã bị dùng chưa (replay)
        const refreshTokenUsedBefore = await Promise.all(
          (tokenRecord.usedTokens || []).map(async (used) => {
            return await bcrypt.compare(refreshToken, used);
          })
        );
        if (refreshTokenUsedBefore.includes(true)) {
          await this.tokenRepo.delete({ id: tokenRecord.id });
          throw new UnauthorizedException('Refresh token already used, please log in again');
        }
      
        // 3. Verify RT hash hiện tại
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, tokenRecord.refreshTokenHash);
        if (!isRefreshTokenValid) {
          throw new UnauthorizedException('Invalid refresh token');
        }
      
        // 4. Generate AT & RT mới
        const payload = { sub: userId };
        const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const newRefreshToken = this.jwtService.sign(payload, {
          expiresIn: Math.floor((tokenRecord.refreshTokenExpiresAt.getTime() - Date.now()) / 1000), // giữ nguyên thời gian còn lại
        });
      
        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
      
        // 5. Update DB: thêm RT cũ vào usedTokens
        tokenRecord.usedTokens = [...(tokenRecord.usedTokens || []), await bcrypt.hash(refreshToken, 10)];
        tokenRecord.refreshTokenHash = newRefreshTokenHash;
      
        await this.tokenRepo.save(tokenRecord);
      
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
