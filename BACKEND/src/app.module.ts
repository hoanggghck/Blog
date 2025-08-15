import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
// Development imports
import { UserModule } from './modules/user/user.module';
import { AuthenticaitonMiddleware } from './common/middleware/authentication.middlewares';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware';
import { DatabaseModule } from './database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TokenRepoModule } from './modules/token/token.module';
import { JwtGlobalModule } from './jwt.module';
import { RoleModule } from './modules/role/role.module';
import { BlogModule } from './modules/blog/blog.module';
import { CategoryModule } from './modules/category/category.module';
import { RolesGuard } from './common/guard/roles.guard';
import { RedisModule } from './redis.module';

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
        AuthModule,
        RoleModule,
        BlogModule,
        CategoryModule,
        RedisModule
    ],
    providers: [
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticaitonMiddleware)
            .exclude(
            { path: 'login', method: RequestMethod.ALL },
            { path: 'register', method: RequestMethod.ALL },
            { path: 'refresh', method: RequestMethod.ALL },
            )
            .forRoutes('*');
        consumer.apply(RateLimiterMiddleware).forRoutes("user/login", "user/register")
    }
}
