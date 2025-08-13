import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        "roles",
        [
          context.getHandler(),
          context.getClass(),
        ],
      );
  
      if (!requiredRoles || requiredRoles.length === 0) {
        return true; // Không khai báo role => không cần check
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      
      if (!user || !user.role) {
        throw new ForbiddenException('No role found');
      }
  
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('You do not have permission');
      }
  
      return true;
    }
  }
  