import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { MyLogger } from './logger/my.log';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));

    app.useLogger(new MyLogger());

    const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

    // CORS setup
    app.enableCors({
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'), false);
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization, refreshToken',
        credentials: true,
    });
    // Set timeout API 5s
    app.useGlobalInterceptors(new TimeoutInterceptor(app.get(Reflector)));
    // Enable class-transformer serialization
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
        new TransformInterceptor()
    );

    await app.listen(3088);
}
bootstrap();
