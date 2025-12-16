import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { BlogStatus } from './enums/blog-status.enum';
import { Image } from '../image/entities/image.entity';
import { ImageService } from '../image/image.service';
import { Category } from '../category/entities/category.entity';
import { BlogType } from 'src/types/blog';

@Injectable()
export class BlogService {
    private readonly backendUrl: string;
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepo: Repository<Blog>,

        @InjectRepository(Tag)
        private readonly tagRepo: Repository<Tag>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Image)
        private readonly imageRepo: Repository<Image>,
        
        private readonly imageService: ImageService,
    ) {
        this.backendUrl = process.env.BACKEND_URL || 'http://localhost:3088';
    }

    private mapBlogEntityToDto(blog: Blog): BlogType {
        return {
            id: blog.id,
            slug: blog.slug,
            title: blog.title,
            content: blog.content,
            author: { id: blog.author.id, name: blog.author.name },
            tag: { id: blog.tag.id, name: blog.tag.name },
            category: { id: blog.category.id, name: blog.category.name },
            createdAt: blog.createdAt.toString(),
            thumbnailUrl: `${this.backendUrl}${blog.thumbnail?.url}` || null,
        };
    }

    async create(dto: CreateBlogDto, authorId: number, file?: Express.Multer.File) {
        const tag = await this.tagRepo.findOne({ where: { id: dto.tagId } });
        if (!tag) throw new NotFoundException('Không tìm thấy tag');
    
        const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
        if (!category) throw new NotFoundException('Không tìm thấy category');
    
        const author = await this.userRepo.findOne({ where: { id: authorId } });
        if (!author) throw new NotFoundException('Không tìm thấy user');
    
        let image: Image | null = null;
        if (file) {
          image = await this.imageService.uploadImage(file);
        }
    
        const blog = this.blogRepo.create({
            ...dto,
            author,
            tag,
            category,
            thumbnail: image ?? null,
            status: dto.status ?? BlogStatus.DRAFT,
        });
    
        await this.blogRepo.save(blog);
        return {
            id: blog.id
        }
    }

    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        try {
            const blogs = await this.blogRepo.find({
                relations: ['author', 'tag', 'category', 'thumbnail'],
                order: { createdAt: 'DESC' },
                skip,
                take: limit,
            });
            if (!blogs) return [];
            return blogs.map((blog) => this.mapBlogEntityToDto(blog));
        } catch (error) {
          throw new InternalServerErrorException(error.message || 'Lỗi không lấy được thông tin');
        }
    }
    
    async findOne(id: number): Promise<BlogType> {
        const blog = await this.blogRepo.findOne({
            where: { id },
            relations: ['author', 'tag', 'category', 'thumbnail'],
        });
        if (!blog) throw new NotFoundException('Không tìm thấy blog');
        return this.mapBlogEntityToDto(blog);
    }

    async update(id: number, dto: UpdateBlogDto, file?: Express.Multer.File) {
        const blog = await this.blogRepo.findOne({ where: { id }, relations: ['thumbnail'] });
        if (!blog) throw new NotFoundException('Không tìm thấy blog');
    
        if (dto.tagId) {
          const tag = await this.tagRepo.findOne({ where: { id: dto.tagId } });
          if (!tag) throw new NotFoundException('Không tìm thấy tag');
          blog.tag = tag;
        }
    
        if (dto.categoryId) {
          const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
          if (!category) throw new NotFoundException('Không tìm thấy category');
          blog.category = category;
        }
    
        if (file) {
          const image = await this.imageService.uploadImage(file);
          blog.thumbnail = image;
        }
    
        Object.assign(blog, dto);
        return await this.blogRepo.save(blog);
    }

    async remove(id: number) {
        try {
          const blog = await this.blogRepo.findOne({ where: { id }, relations: ['thumbnail'] });
          if (!blog) throw new NotFoundException('Không tìm thấy blog');
    
          if (blog.thumbnail) {
            await this.imageService.remove(blog.thumbnail.id);
          }
    
          await this.blogRepo.remove(blog);
          return { success: true };
        } catch (error) {
          throw new InternalServerErrorException(error.message || 'Lỗi xóa blog');
        }
    }

    async countPostsByCategory() {
        const result = await this.blogRepo
        .createQueryBuilder('blog')
        .select('category.name', 'category')
        .addSelect('COUNT(blog.id)', 'count')
        .innerJoin('blog.category', 'category')
        .groupBy('category.name')
        .getRawMany();

        return result.map((row) => ({
            category: row.category,
            count: Number(row.count),
        }));
    }
}
