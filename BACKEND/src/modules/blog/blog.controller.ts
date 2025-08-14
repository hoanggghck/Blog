import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BaseResponse } from 'src/base/base.response';

@Controller('blog')
export class BlogController extends BaseResponse {
  constructor(private readonly blogService: BlogService) {
    super()
  }

  @Post()
  async create(@Body() dto: CreateBlogDto, @Req() req: any) {
    return this.success({
        message: 'Tạo thành công',
        result: await this.blogService.create(dto, req.userId),
    });
  }

  @Get()
  async findAll() {
    return this.success({
        message: 'Lấy danh sách thành công',
        result: await this.blogService.findAll(),
    });
}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.success({
        message: 'Lấy danh sách thành công',
        result: await this.blogService.findOne(+id),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.success({
        message: 'Cập nhật blog thành công',
        result: await this.blogService.update(+id, dto),
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.success({
        message: 'Cập nhật blog thành công',
        result: await this.blogService.remove(+id),
    });
  }
}
