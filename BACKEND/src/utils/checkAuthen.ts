import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RefreshTokenMismatchException } from 'src/common/exceptions/refresh-token-mismatch.exception';
import { TokenExpiredException } from 'src/common/exceptions/token-expired.exception';

export async function checkAuthen(
    jwtService: JwtService,
    accessToken: string,
    refreshToken: string,
    tokenRepo?: any
  ) {
    if (!accessToken) {
      throw new UnauthorizedException('Missing access token');
    }
    if (accessToken.startsWith('Bearer ')) {
        accessToken = accessToken.split(' ')[1];
    } 

    let decoded;
    try {
      decoded = jwtService.decode(accessToken) as any;
    } catch {
      throw new UnauthorizedException('Invalid token format');
    }
    console.log(decoded);
    
    return {}
    
  }
  
