import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { NotificationGateway } from '../notification/notification.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ReactionService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
        private readonly notificationGateway: NotificationGateway,

        @InjectRepository(Blog)
        private readonly blogRepo: Repository<Blog>
    ) {}


    private getReactionKey(blogId: string) {
        return `blog:${blogId}:reactions`;
    }

    async addReaction(blogId: string, userId: string) {
        const key = this.getReactionKey(blogId);
        const added = await this.redisClient.sadd(key, userId);
      
        if (added) {
          // Nếu user mới like → tăng điểm ranking
            await this.redisClient.zincrby(this.getRankingKey('alltime'), 1, blogId);
            await this.redisClient.zincrby(this.getRankingKey('day'), 1, blogId);
            await this.redisClient.zincrby(this.getRankingKey('week'), 1, blogId);
            await this.redisClient.zincrby(this.getRankingKey('month'), 1, blogId);
            await this.redisClient.zincrby(this.getRankingKey('year'), 1, blogId);
        }
      
        return { blogId, userId, reacted: true };
    }

    // User bỏ "like"
    async removeReaction(blogId: string, userId: string) {
        const key = this.getReactionKey(blogId);
        await this.redisClient.srem(key, userId); // xoá userId khỏi set
        return { blogId, userId, reacted: false };
    }

    // Lấy tất cả user đã like post
    async getReactions(blogId: string): Promise<string[]> {
        const key = this.getReactionKey(blogId);
        return await this.redisClient.smembers(key); // trả về danh sách userId
    }

    // Lấy số lượng reaction
    async countReactions(blogId: string): Promise<number> {
        const key = this.getReactionKey(blogId);
        return await this.redisClient.scard(key);
    }

    // Kiểm tra user đã reaction chưa
    async hasReacted(blogId: string, userId: string): Promise<boolean> {
        const key = this.getReactionKey(blogId);
        const result = await this.redisClient.sismember(key, userId);
        return result === 1;
    }

    //test socket 
    async addLike(blogId: string, userId: string) {
        // giả định chủ post = user123
        const postOwnerId = 'user123';
    
        // bắn notify
        this.notificationGateway.notifyUser(postOwnerId, {
          type: 'LIKE',
          blogId,
          fromUserId: userId,
        });
    
        return { message: 'Reaction added!' };
    }

    async getPopular(limit = 10) {
        return this.redisClient.zrevrange(this.getRankingKey('alltime'), 0, limit - 1, 'WITHSCORES');
    }
      
    async getHot(period: 'day' | 'week' | 'month' | 'year', limit = 10) {
        return this.redisClient.zrevrange(this.getRankingKey(period), 0, limit - 1, 'WITHSCORES');
    }

    async getRecommended(userTagIds: number[], limit = 10) {
        const hot = await this.getHot('week', 50); // lấy top 50 tuần
        const blogIds = hot.map(([blogId]) => Number(blogId));
      
        const blogs = await this.blogRepo.find({
            where: { id: In(blogIds) },
            relations: ['tag'],
        });
        return blogs.filter(blog => userTagIds.includes(blog.tagId)).slice(0, limit);
    }

    private getRankingKey(period: 'alltime' | 'day' | 'week' | 'month' | 'year') {
        const now = new Date();
        switch (period) {
            case 'day':
                return `ranking:day:${now.toISOString().slice(0, 10)}`;
            case 'week':
                const week = this.getWeekNumber(now);
                return `ranking:week:${now.getFullYear()}-${week}`;
            case 'month':
                return `ranking:month:${now.getFullYear()}-${now.getMonth() + 1}`;
            case 'year':
                return `ranking:year:${now.getFullYear()}`;
            default:
                return `ranking:alltime`;
        }
    }
      
    private getWeekNumber(date: Date): number {
        const onejan = new Date(date.getFullYear(), 0, 1);
        const millisecsInDay = 86400000;
        return Math.ceil(((date.getTime() - onejan.getTime()) / millisecsInDay + onejan.getDay() + 1) / 7);
    }
}
