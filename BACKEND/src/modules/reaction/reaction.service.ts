import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ReactionService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis
    ) {}


    private getReactionKey(postId: string) {
        return `post:${postId}:reactions`;
    }

    async addReaction(postId: string, userId: string) {
        const key = this.getReactionKey(postId);
        await this.redisClient.sadd(key, userId); // thêm userId vào set
        return { postId, userId, reacted: true };
    }

    // User bỏ "like"
    async removeReaction(postId: string, userId: string) {
        const key = this.getReactionKey(postId);
        await this.redisClient.srem(key, userId); // xoá userId khỏi set
        return { postId, userId, reacted: false };
    }

    // Lấy tất cả user đã like post
    async getReactions(postId: string): Promise<string[]> {
        const key = this.getReactionKey(postId);
        return await this.redisClient.smembers(key); // trả về danh sách userId
    }

    // Lấy số lượng reaction
    async countReactions(postId: string): Promise<number> {
        const key = this.getReactionKey(postId);
        return await this.redisClient.scard(key);
    }

    // Kiểm tra user đã reaction chưa
    async hasReacted(postId: string, userId: string): Promise<boolean> {
        const key = this.getReactionKey(postId);
        const result = await this.redisClient.sismember(key, userId);
        return result === 1;
    }
}
