import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RequestService } from './request.service';
import { AuthenticaitonMiddleware } from './middleware/authentication.middlewares';
import { RateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // để mọi module đều dùng được
      envFilePath: '.env', 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        synchronize: true,
      }),
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
