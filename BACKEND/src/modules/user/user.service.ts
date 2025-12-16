
import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}
    private checkUserEsist = async (id: number) => {
        const user = await this.userRepo.findOne({
            where: { id: id }
        });
        if (!user) throw new NotFoundException('Không tìm thấy người dùng');
        return user;
    }

    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
      
        const [data, total] = await this.userRepo.findAndCount({
            skip,
            take: limit,
        });
        const items = data.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            roleName: user.role?.name ?? null,
            status: user.status,
        }));
      
        return {
            items: items,
            total,
            page,
            limit,
        };
    }

    async findOne(id: number) {
        const user = await this.userRepo.findOne({
            where: { id: id },
            select: {
                id: true,
                name: true,
                avatarUrl: true,
                email: true
            }
        });
        if (!user) throw new NotFoundException('Không tìm thấy người dùng');
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.checkUserEsist(id);
        const result = await this.userRepo.update(
            { name: updateUserDto.username},
            { email: updateUserDto.email}
        );

        if (result.affected && result.affected > 0) {
            throw new BadGatewayException('Cập nhật thất bại')
        }
        return `Cập nhật thành công`;

    }

    async remove(id: number) {
        await this.checkUserEsist(id);
        const result = await this.userRepo.delete({ id });
        if (!result.affected || result.affected === 0) {
            throw new BadGatewayException('Xóa thất bại')
        }
        return `Xóa thành công`;
    }
}
