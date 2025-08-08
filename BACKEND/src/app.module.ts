import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RequestService } from './request.service';
import { AuthenticaitonMiddleware } from './middleware/authentication.middlewares';
import { RateLimiterMiddleware } from './middleware/rate-limiter.middleware';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, RequestService]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticaitonMiddleware).forRoutes("*")//{ path: "/path", method: RequestMethod.GET } or global {"*"}
    consumer.apply(RateLimiterMiddleware).forRoutes("user/login", "user/register")
  }
}
