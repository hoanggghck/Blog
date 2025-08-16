import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { User } from 'src/modules/user/entities/user.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Tag]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
