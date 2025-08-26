import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BaseResponse } from 'src/base/base.response';
import { TokenResponseType } from 'src/types/common.';
import { Public } from 'src/common/decorator/public.router';

@Controller()
export class AuthController extends BaseResponse {
    constructor(private readonly authService: AuthService) {
        super()
    }

    @Public()
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.success({
            message: 'Đăng ký người dùng thành công',
            result: await this.authService.register(registerDto)
        });
    }

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.success<TokenResponseType>({
            message: 'Đăng nhập thành công',
            result: await this.authService.login(loginDto),
        });
    }

    @Public()
    @Get('refresh')
    async refreshTokens(@Req() req) {
        let accessToken = req.headers['authorization'];
        const refreshToken = req.headers['refreshtoken'];
        if (accessToken && accessToken.startsWith('Bearer ')) {
            accessToken = accessToken.split(' ')[1];
        }
        return this.success<TokenResponseType>({
            message: 'Làm mới token thành công',
            result: await this.authService.refreshTokens(accessToken, refreshToken)
        });
    }

    @Get('logout')
    async logout(@Req() req) {
        const refreshToken = req.headers['refreshtoken'];
        return this.success<boolean>({
            message: 'Đăng xuất thành công',
            result: await this.authService.logout(refreshToken),
        });
    }

    @Public()
    @Post('google-login')
    async googleLogin(@Body('accessToken') accessToken: string) {
        return this.success({
            message: 'Đăng nhập Google thành công',
            result: await this.authService.googleLoginWithAccessToken(accessToken),
        });
    }
}
