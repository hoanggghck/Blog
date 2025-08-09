import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseResponse } from 'src/base/base.response';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController extends BaseResponse {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.success<CreateUserDto>({
      message: 'User created successfully',
      result: this.userService.create(createUserDto),
    })
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto.username, loginDto.password);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }
  
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.success<string>({
      code: 201,
      message: 'User created successfully',
      result: this.userService.findOne(id),
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
