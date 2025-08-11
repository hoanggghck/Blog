import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BaseResponse } from 'src/base/base.response';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('auth')
export class AuthController extends BaseResponse {
  constructor(private readonly authService: AuthService) {
    super()
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshTokens(@Req() req, @Body('refreshToken') refreshToken: string) {
  const userId = req.user.sub; // lấy từ payload JWT hoặc guard đã decode
    console.log("userId", userId)
  const { accessToken, refreshToken: newRefreshToken } =
    await this.authService.refreshTokens(userId, refreshToken);

  return this.success({
    message: 'Làm mới token thành công',
    result: {
      accessToken,
      refreshToken: newRefreshToken,
    },
  });
}

  
}
