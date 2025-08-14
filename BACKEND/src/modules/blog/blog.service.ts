import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { BlogStatus } from './enums/blog-status.enum';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepo: Repository<Blog>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async create(dto: CreateBlogDto, authorId: number) {
        try {
          const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
          if (!category) throw new NotFoundException('Không tìm thấy mục này ');

          const author = await this.userRepo.findOne({ where: { id: authorId } });
          if (!author) throw new NotFoundException('Không tìm thấy người dùng này');

          const blog = this.blogRepo.create({
            ...dto,
            category,
            author,
            status: dto.status ?? BlogStatus.DRAFT,
          });

          await this.blogRepo.save(blog);
          return true
        } catch (error) {
          throw new InternalServerErrorException(error.message || 'Lỗi không tạo được blog');
        }
      }

      async findAll() {
        try {
          return await this.blogRepo.find({
            relations: ['author', 'category'],
            order: { createdAt: 'DESC' },
          });
        } catch (error) {
          throw new InternalServerErrorException(error.message || 'Lỗi không lấy được thông tin');
        }
      }

      async findOne(id: number) {
        try {
          const blog = await this.blogRepo.findOne({
            where: { id },
            relations: ['author', 'category'],
          });
          if (!blog) throw new NotFoundException('Không tìm thấy blog');

          return blog;
        } catch (error) {
          throw new InternalServerErrorException(error.message || 'Lỗi không lấy được thông tin chi tiết');
        }
      }

      async update(id: number, dto: UpdateBlogDto) {
        try {
          const blog = await this.blogRepo.findOne({ where: { id } });
          if (!blog) throw new NotFoundException('Không tìm thấy blog');

          if (dto.categoryId) {
            const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
            if (!category) throw new NotFoundException('Không tìm thấy mục này');
            blog.category = category;
          }

          Object.assign(blog, dto);
          await this.blogRepo.save(blog);
          return true
        } catch (error) {
          throw new InternalServerErrorException(error.message || 'Lỗi cập nhật blog');
        }
      }

      async remove(id: number) {
        try {
          const blog = await this.blogRepo.findOne({ where: { id } });
          if (!blog) throw new NotFoundException('Không tìm thấy blog');

          await this.blogRepo.remove(blog);
          return true;
        } catch (error) {
          throw new InternalServerErrorException(error.message || 'Lỗi xóa blog');
        }
      }
}
