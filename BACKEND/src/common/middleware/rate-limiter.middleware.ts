import { Injectable, NestMiddleware } from "@nestjs/common";
import rateLimit from "express-rate-limit";

//co the tich hop Redis de chia se rate limit giua nhieu instance
@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
    private limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 phút
        max: 100, // Giới hạn mỗi IP 100 requests mỗi 15 phút
        message: {
          code: 429,
          message: 'Too many requests. Please try again later.',
        },
        standardHeaders: true, // Thêm rate limit info vào headers
        legacyHeaders: false,
    })

    use(req: any, res: any, next: (error?: any) => void) {
        return this.limiter(req, res, next)
    }
}