import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// Development imports
import { UserModule } from './user/user.module';
import { AuthenticaitonMiddleware } from './common/middleware/authentication.middlewares';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { TokenRepoModule } from './token/token.module';
import { JwtGlobalModule } from './jwt.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        JwtGlobalModule,
        DatabaseModule,
        TokenRepoModule,
        UserModule,
        AuthModule
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticaitonMiddleware).forRoutes("*")
        consumer.apply(RateLimiterMiddleware).forRoutes("user/login", "user/register")
    }
}
