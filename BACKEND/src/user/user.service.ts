
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto): CreateUserDto {
    if (createUserDto?.userName) {
      return createUserDto;
    }
    throw new BadRequestException('User creation failed');
  }

  
  async register(dto: RegisterDto) {
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    await this.userRepo.save(user);
    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
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
