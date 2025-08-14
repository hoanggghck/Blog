import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BaseResponse } from 'src/base/base.response';

@Controller('role')
export class RoleController extends BaseResponse {
  constructor(private readonly roleService: RoleService) {
    super()
  }

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return this.success({
        message: 'Tạo mới role thành công',
        result: await this.roleService.create(dto)
    });
  }

  @Get()
  async findAll() {
    return this.success({
        message: 'Tìm tất cả role thành công',
        result: await this.roleService.findAll()
    });
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.success({
        message: 'Tạo mới role thành công',
        result: await this.roleService.findOne(id)
    });
  }
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.success({
        message: 'Tạo mới role thành công',
        result: await this.roleService.update(id, dto)
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.success({
        message: 'Tạo mới role thành công',
        result: await this.roleService.remove(id)
      });
  }
}
