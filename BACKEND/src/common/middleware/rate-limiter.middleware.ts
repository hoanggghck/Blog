import { Injectable, NestMiddleware } from "@nestjs/common";
import rateLimit from "express-rate-limit";

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
    private limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: {
          code: 429,
          message: 'Quá nhiều yêu cầu từ địa chỉ IP này, vui lòng thử lại sau 15 phút',
        },
        standardHeaders: true,
        legacyHeaders: false,
    })

    use(req: any, res: any, next: (error?: any) => void) {
        return this.limiter(req, res, next)
    }
}