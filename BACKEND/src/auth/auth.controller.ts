import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BaseResponse } from 'src/base/base.response';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { TokenResponseType } from 'src/types/common.';

@Controller()
export class AuthController extends BaseResponse {
    constructor(private readonly authService: AuthService) {
        super()
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.success({
            message: 'User registered successfully',
            result: await this.authService.register(registerDto)
        });
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.success<TokenResponseType>({
            message: 'Login successful',
            result: await this.authService.login(loginDto),
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('refresh')
    async refreshTokens(@Req() req) {
        return {}
        // const userId = req.user.sub;

        // return this.success<TokenResponseType>({
        //     message: 'Làm mới token thành công',
        //     result: await this.authService.refreshTokens(userId, refreshToken)
        // });
    }

    @Post('logout')
    async logout(@Req() req) {
        const userId = req.user.sub;

        return this.success<boolean>({
            message: 'Logout successful',
            result: await this.authService.logout(userId),
        });
    }
}
