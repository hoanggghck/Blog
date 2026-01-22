import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseResponse } from 'src/base/base.response';
import { RolesGuard } from 'src/common/guard/roles.guard';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController extends BaseResponse {
    constructor(
        private readonly userService: UserService,
    ){
        super();
    }
    
    @Get()
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        return this.success({
            message: 'Lấy danh sách user thành công',
            result: await this.userService.findAll(pageNum, limitNum),
        });
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
