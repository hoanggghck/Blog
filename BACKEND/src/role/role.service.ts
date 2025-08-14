import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>
    ){}

    async create(dto: CreateRoleDto) {
        try {
            const role = this.roleRepo.create(dto);
            await this.roleRepo.save(role);
            return role
        } catch(err) {
            throw new InternalServerErrorException({ message: 'Tạo role thất bại' })
        }
    }

    async findAll() {
        try {
            const roles = await this.roleRepo.find();
            return roles
        } catch(err) {
            throw new InternalServerErrorException({ message: 'Tìm tất cả role thất bại' })
        }
    }

    async findOne(id: number) {
        try {
            const role = await this.roleRepo.findOne({ where: { id } });
            if (!role) throw new NotFoundException(`không tìm thấy role`);
            return role;
        } catch(err) {
            throw new InternalServerErrorException({ message: 'Tìm role thất bại' })
        }
    }

    async update(id: number, dto: UpdateRoleDto) {
        try {
            const role = await this.roleRepo.findOne({ where: { id } });
            if (!role) throw new NotFoundException(`không tìm thấy role`);
            Object.assign(role, dto);
            await this.roleRepo.save(role);
            return role
        } catch(err) {
            throw new InternalServerErrorException({ message: 'Cập nhật role thất bại' })
        }
    }

    async remove(id: number) {
        try {
            const role = await this.roleRepo.findOne({ where: { id } });
            if (!role) throw new NotFoundException(`không tìm thấy role`);
            await this.roleRepo.remove(role);
            return true
        } catch(err) {
            throw new InternalServerErrorException({ message: 'Xóa role thất bại' })
        }
    }
}
