import {
    Controller,
    Post,
    Get,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import type { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImageService } from './image.service';
import { BaseResponse } from 'src/base/base.response';
  
@Controller('images')
export class ImageController extends BaseResponse {
    constructor(private readonly imageService: ImageService) {
        super();
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        return this.success({
            message: 'Upload ảnh thành công',
            result: await this.imageService.uploadImage(file),
        });
    }

    @Get(':id')
    async getImage(@Param('id') id: string) {
        return this.success({
            message: 'Lấy ảnh thành công',
            result: await this.imageService.getImage(+id),
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.success({
            message: 'Xóa ảnh thành công',
            result: await this.imageService.remove(+id),
        });
    }
}
  