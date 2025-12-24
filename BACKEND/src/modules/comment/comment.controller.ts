import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BaseResponse } from 'src/base/base.response';

@Controller('comment')
export class CommentController extends BaseResponse {
  constructor(private readonly commentService: CommentService) {
    super()
  }
  @Post()
  async create(@Body() dto: CreateCommentDto, @Req() req: any) {
    return this.success({
      message: 'Tạo comment thành công',
      result: await this.commentService.create(dto, req.userId),
    });
  }
  @Get('blog/:blogId')
  async getCommentsByBlogId(@Param('blogId') blogId: string) {
    return this.success({
      message: 'Lấy danh sách comment thành công',
      result: await this.commentService.getCommentsByBlogId(+blogId),
    });
  }
}
