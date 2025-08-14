import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { User } from 'src/modules/user/entities/user.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
