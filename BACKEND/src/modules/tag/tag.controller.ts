import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { BaseResponse } from 'src/base/base.response';

@Controller('tag')
export class TagController extends BaseResponse {
    constructor(private readonly tagService: TagService) {
        super()
    }

    // @Roles('admin')
    @Post()
    async create(@Body() createTagDto: CreateTagDto) {
        return this.success({
            message: 'Tạo thành công',
            result: await this.tagService.create(createTagDto),
        });
    }

    @Get()
    async findAll() {
        const items = await this.tagService.findAll();
        return this.success({
            message: 'Lấy danh sách thành công',
            result: {
                items,
                total: items.length,
            },
        });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.success({
            message: 'Lấy mục thành công',
            result: await this.tagService.findOne(+id),
        });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
        return this.success({
            message: 'Cập nhật mục thành công',
            result: await this.tagService.update(+id, dto),
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.success({
            message: 'Xóa mục thành công',
            result: await this.tagService.remove(+id),
        });
    }
}
