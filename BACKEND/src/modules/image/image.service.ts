import { Injectable, NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { Image } from './entities/image.entity';
import { slugifyFilename } from 'src/utils';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
    ) {}

    async uploadImage(file: Express.Multer.File) {
        if (!file) throw new Error('Không có file upload');
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            throw new UnsupportedMediaTypeException('Kích thước file vượt quá 5MB');
        }
        const allowedExt = ['.png', '.jpg', '.jpeg'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (!allowedExt.includes(ext)) {
            throw new UnsupportedMediaTypeException('Định dạng file không hợp lệ. Chỉ cho phép PNG, JPG, JPEG');
        }
        // 1. Lưu file ra public/images
        const uploadDir = path.join(process.cwd(), 'public', 'images');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filename = `${Date.now()}-${slugifyFilename(file.originalname)}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, file.buffer);

        const image = this.imageRepository.create({
            filename: filename,
            mimetype: file.mimetype,
            data: file.buffer,
            url: `/images/${filename}`,
        });

        return await this.imageRepository.save(image);
    }

    async getImage(id: number) {
        const image = await this.imageRepository.findOne({ where: { id } });
        if (!image) throw new NotFoundException('Ảnh không tồn tại');
        return image;
    }

    async remove(id: number) {
        const image = await this.imageRepository.findOne({ where: { id } });
        if (!image) throw new NotFoundException('Ảnh không tồn tại');

        // Xóa file trong public/images
        const filePath = path.join(process.cwd(), 'public', 'images', image.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await this.imageRepository.remove(image);

        return { success: true };
    }
}
