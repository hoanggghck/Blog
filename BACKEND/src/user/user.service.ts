import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BaseResponse } from 'src/types/baseResponse';

const filePath = path.resolve(__dirname, '../../user.json');

@Injectable()
export class UserService {
  async readUsers(): Promise<any[]> {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data || '[]');
    } catch (err) {
      return [];
    }
  }

  async writeUsers(users: any[]) {
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
  }

  async register(dto: RegisterDto): Promise<BaseResponse<RegisterDto>>{
    const users = await this.readUsers();

    const existed = users.find(u => u.username === dto.username);
    if (existed) throw new BadRequestException('Username đã tồn tại');

    const newUser = {
      id: Date.now(),
      ...dto,
    };

    users.push(newUser);
    await this.writeUsers(users);

    return {
      message: 'Đăng ký thành công',
      result: newUser,
    };
  }

  async login(dto: LoginDto): Promise<BaseResponse<LoginDto>>{
    const users = await this.readUsers();

    const found = users.find(
      u => u.username === dto.username && u.password === dto.password,
    );

    if (!found) throw new BadRequestException('Email hoặc mật khẩu sai');

    return {
      message: 'Đăng nhập thành công',
      result: found,
    };
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
