import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { RequestService } from "src/request.service";

@Injectable()
export class AuthenticaitonMiddleware implements NestMiddleware {
    constructor(private readonly requestService: RequestService) {}
    use(req: Request, res: Response, next: NextFunction) {
        const userId = req.headers['x-user-id'] || 'anonymous';
        this.requestService.setUserId(userId);
        
        next()
    }
}
