import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
 
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            "roles",
            [
            context.getHandler(),
            context.getClass(),
            ],
        );
    
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
  
        const request = context.switchToHttp().getRequest();
        
        if (!request?.user?.sub) {
            throw new ForbiddenException('Sai đầu vào hoặc thiếu thông tin user');
        }

        const user = await this.userRepo.findOne({ where: { id: request.user.sub }});

        if(!user?.roleId) {
            throw new ForbiddenException('Không kiếm thấy vai trò');
        }
        const role = await this.roleRepo.findOne({ where: { id: user.roleId }});

        if (!role || !requiredRoles.includes(role.name)) {
            throw new ForbiddenException('Bạn không có quyền');
        }
  
      return true;
    }
  }
  