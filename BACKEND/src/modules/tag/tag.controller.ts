import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { BaseResponse } from 'src/base/base.response';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('category')
export class TagController extends BaseResponse {
    constructor(private readonly categoryService: TagService) {
        super()
    }

    @Roles('admin')
    @Post()
    async create(@Body() createTagDto: CreateTagDto) {
        return this.success({
            message: 'Tạo thành công',
            result: await this.categoryService.create(createTagDto),
        });
    }

    @Get()
    async findAll() {
        return this.success({
            message: 'Lấy danh sách thành công',
            result: await this.categoryService.findAll(),
        });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.success({
            message: 'Lấy mục thành công',
            result: await this.categoryService.findOne(+id),
        });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
        return this.success({
            message: 'Cập nhật mục thành công',
            result: await this.categoryService.update(+id, dto),
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.success({
            message: 'Xóa mục thành công',
            result: await this.categoryService.remove(+id),
        });
    }
}
