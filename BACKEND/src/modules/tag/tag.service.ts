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
        private readonly tagRepo: Repository<Tag>,
    ) {}

    async create(dto: CreateTagDto) {
        try {
          const exists = await this.tagRepo.findOne({ where: { slug: dto.slug } });
          if (exists) throw new BadRequestException('Slug đã tồn tại');
    
          const tag = this.tagRepo.create(dto);
          await this.tagRepo.save(tag);
          return true;
        } catch (error) {
            throw new InternalServerErrorException(
                error.message || 'Lỗi không tạo được tag',
            );
        }
    }

    async findAll() {
        try {
          return await this.tagRepo.find({
            order: { createdAt: 'DESC' },
          });
        } catch (error) {
          throw new InternalServerErrorException(
            error.message || 'Lỗi không lấy được danh sách tag',
          );
        }
    }

    async findOne(id: number) {
        try {
            const tag = await this.tagRepo.findOne({ where: { id } });
            if (!tag) throw new NotFoundException('Không tìm thấy tag này');
            return tag;
        } catch (error) {
            throw new InternalServerErrorException(
                error.message || 'Lỗi không lấy được tag',
            );
        }
    }

    async update(id: number, dto: UpdateTagDto) {
        try {
          const tag = await this.tagRepo.findOne({ where: { id } });
          if (!tag) throw new NotFoundException('Không tìm thấy tag này');
    
          Object.assign(tag, dto);
          await this.tagRepo.save(tag);
          return true;
        } catch (error) {
          throw new InternalServerErrorException(
            error.message || 'Lỗi không cập nhật được tag',
          );
        }
    }

    async remove(id: number) {
        try {
          const tag = await this.tagRepo.findOne({ where: { id } });
          if (!tag) throw new NotFoundException('Không tìm thấy tag này');
    
          await this.tagRepo.remove(tag);
          return true;
        } catch (error) {
          throw new InternalServerErrorException(
            error.message || 'Lỗi không xóa được tag',
          );
        }
    }
}
