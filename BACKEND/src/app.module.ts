import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RequestService } from './request.service';
import { AuthenticaitonMiddleware } from './middleware/authentication.middlewares';
import { RateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '123456',
      database: process.env.DB_NAME || 'blogdb',
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'], // load tất cả entity
      synchronize: true,
    }),
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
