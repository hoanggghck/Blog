import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { BaseResponse } from 'src/base/base.response';

@Controller('category')
export class CategoryController extends BaseResponse {
    constructor(private readonly categoryService: CategoryService) {
        super()
    }

    @Roles('admin')
    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.success({
            message: 'Tạo thành công',
            result: await this.categoryService.create(createCategoryDto),
        });
    }

    @Get()
    async findAll() {
        const items = await this.categoryService.findAll();
        return this.success({
            message: 'Lấy danh sách thành công',
            result: await this.categoryService.findAll()
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
    async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
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
