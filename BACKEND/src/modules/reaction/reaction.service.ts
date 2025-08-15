// post-reaction.service.ts
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ReactionService {
  constructor(
     @Inject('REDIS_CLIENT') private readonly redisClient: Redis
  ) {}

  async setReaction(postId: string, userId: string) {
    await this.redisClient.set('123', '321');
  }

  async getReaction(postId: string) {
    await this.redisClient.get('123');

  }

  async deleteReaction(postId: string) {

  }
}
