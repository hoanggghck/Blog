import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class AuthenticaitonMiddleware implements NestMiddleware {
    constructor() {}
    use(req: Request, res: Response, next: NextFunction) {
        // const userId = req.headers['x-user-id'] || 'anonymous';
        next()
    }
}
