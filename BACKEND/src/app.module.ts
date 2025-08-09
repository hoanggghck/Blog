import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RequestService } from './request.service';
import { AuthenticaitonMiddleware } from './middleware/authentication.middlewares';
import { RateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env', 
    }),
    DatabaseModule,
    UserModule],
  controllers: [AppController],
  providers: [AppService, RequestService]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticaitonMiddleware).forRoutes("*")//{ path: "/path", method: RequestMethod.GET } or global {"*"}
    consumer.apply(RateLimiterMiddleware).forRoutes("user/login", "user/register")
  }
}
