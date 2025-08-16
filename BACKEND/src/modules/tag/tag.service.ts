import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly categoryRepo: Repository<Tag>,
    ) {}

    async create(dto: CreateTagDto) {
        try {
          const exists = await this.categoryRepo.findOne({ where: { slug: dto.slug } });
          if (exists) throw new BadRequestException('Slug đã tồn tại');
    
          const category = this.categoryRepo.create(dto);
          await this.categoryRepo.save(category);
          return true;
        } catch (error) {
            throw new InternalServerErrorException(
                error.message || 'Lỗi không tạo được category',
            );
        }
    }

    async findAll() {
        try {
          return await this.categoryRepo.find({
            order: { createdAt: 'DESC' },
          });
        } catch (error) {
          throw new InternalServerErrorException(
            error.message || 'Lỗi không lấy được danh sách category',
          );
        }
    }

    async findOne(id: number) {
        try {
            const category = await this.categoryRepo.findOne({ where: { id } });
            if (!category) throw new NotFoundException('Không tìm thấy category này');
            return category;
        } catch (error) {
            throw new InternalServerErrorException(
                error.message || 'Lỗi không lấy được category',
            );
        }
    }

    async update(id: number, dto: UpdateTagDto) {
        try {
          const category = await this.categoryRepo.findOne({ where: { id } });
          if (!category) throw new NotFoundException('Không tìm thấy category này');
    
          Object.assign(category, dto);
          await this.categoryRepo.save(category);
          return true;
        } catch (error) {
          throw new InternalServerErrorException(
            error.message || 'Lỗi không cập nhật được category',
          );
        }
    }

    async remove(id: number) {
        try {
          const category = await this.categoryRepo.findOne({ where: { id } });
          if (!category) throw new NotFoundException('Không tìm thấy category này');
    
          await this.categoryRepo.remove(category);
          return true;
        } catch (error) {
          throw new InternalServerErrorException(
            error.message || 'Lỗi không xóa được category',
          );
        }
    }
}
