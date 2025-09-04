import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { User } from 'src/modules/user/entities/user.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Blog } from './entities/blog.entity';
import { Image } from '../image/entities/image.entity';
import { ImageModule } from '../image/image.module';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, User, Tag, Image, Category]),
    ImageModule
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [TypeOrmModule]
})
export class BlogModule {}
