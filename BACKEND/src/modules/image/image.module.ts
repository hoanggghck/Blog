import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import { ImageController } from './image.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Image]),
    ],
    controllers: [ImageController],
    providers: [ImageService],
    exports: [TypeOrmModule]
})
export class ImageModule {}
