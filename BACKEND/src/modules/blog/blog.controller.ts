import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BaseResponse } from 'src/base/base.response';
import { Public } from 'src/common/decorator/public.router';

@Controller('blog')
export class BlogController extends BaseResponse {
    constructor(private readonly blogService: BlogService) {
        super()
    }

    @Post()
    @UseInterceptors(FileInterceptor('thumbnail'))
    async create(
        @Body() dto: CreateBlogDto,
        @Req() req: any,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.success({
            message: 'Tạo thành công',
            result: await this.blogService.create(dto, req.userId, file),
        });
    }

    @Public()
    @Get()
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '12',
    ) {
        return this.success({
            message: 'Lấy danh sách thành công',
            result: await this.blogService.findAll(parseInt(page, 10), parseInt(limit, 10)),
        });
    }

    @Public()
    @Get('count-category')
    async countCategory() {
        return this.success({
            message: 'Lấy danh sách category thành công',
            result: await this.blogService.countPostsByCategory(),
        });
    }
    
    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.success({
            message: 'Lấy blog thành công',
            result: await this.blogService.findOne(+id),
        });
    }


    @Put(':id')
    @UseInterceptors(FileInterceptor('thumbnail'))
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateBlogDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.success({
            message: 'Cập nhật blog thành công',
            result: await this.blogService.update(+id, dto, file),
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.success({
            message: 'Xóa blog thành công',
            result: await this.blogService.remove(+id),
        });
    }
}
