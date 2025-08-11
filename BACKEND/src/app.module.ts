import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
// Development imports
import { UserModule } from './user/user.module';
import { RequestService } from './request.service';
import { AuthenticaitonMiddleware } from './middleware/authentication.middlewares';
import { RateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { TokenRepoModule } from './token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    TokenRepoModule,
    UserModule,
    AuthModule
  ],
  providers: [
    RequestService,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticaitonMiddleware).forRoutes("*")
    consumer.apply(RateLimiterMiddleware).forRoutes("user/login", "user/register")
  }
}
