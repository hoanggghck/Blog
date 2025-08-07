import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './logger/my.log';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(new MyLogger());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3033);
}
bootstrap();
