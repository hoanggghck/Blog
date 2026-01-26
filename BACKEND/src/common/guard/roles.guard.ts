import {
CanActivate,
ExecutionContext,
Injectable,
NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ROLES } from '../constant/role';


@Injectable()
    export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }
        
        const userId = context.switchToHttp().getRequest().userId;
        const userFound = await this.userRepo.findOne({
            where: { id: userId }
        });
        
        if (!userFound) throw new NotFoundException('Không tìm thấy người dùng');
        if (userFound.role?.id === ROLES.ADMIN) {
            return true;
        }
        return false;
    }
}
