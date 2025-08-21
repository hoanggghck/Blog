import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject, Req } from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseResponse } from 'src/base/base.response';
import { Public } from 'src/common/decorator/public.router';

@Controller('user')
export class UserController extends BaseResponse {
    constructor(
        private readonly userService: UserService,
    ){
        super();
    }
    
    @Get()
    async findAll() {
        return this.success({
            message: 'Lấy danh sách user thành công',
            result: await this.userService.findAll()
        })
    }

    @Get('info')
    async getInfo(@Req() req) {
        return this.success({
            message: 'Thành công',
            result: await this.userService.getInfo(req.userId),
        })
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.success({
            message: 'Thành công',
            result: await this.userService.findOne(id),
        })
    }
    
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }

}
