import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BaseResponse } from 'src/base/base.response';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('category')
export class CategoryController extends BaseResponse {
    constructor(private readonly categoryService: CategoryService) {
        super()
    }

    @UseGuards(RolesGuard)
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
