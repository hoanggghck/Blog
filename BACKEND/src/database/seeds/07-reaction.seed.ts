// 07-reaction.seed.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import Redis from 'ioredis';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { User } from 'src/modules/user/entities/user.entity';

export default class ReactionSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {

    const blogRepo = dataSource.getRepository(Blog);
    const userRepo = dataSource.getRepository(User);

    const blogs = await blogRepo.find({ select: ['id'] });
    const users = await userRepo.find({ select: ['id'] });

    if (!blogs.length || !users.length) {
      console.warn('⚠️ Blogs or Users not found');
      return;
    }

    /* ===================== REDIS ===================== */
    const redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    const MIN_REACTIONS = 3;
    const MAX_REACTIONS = Math.min(10, users.length);

    for (const blog of blogs) {
      const reactionCount =
        Math.floor(
          Math.random() * (MAX_REACTIONS - MIN_REACTIONS + 1),
        ) + MIN_REACTIONS;

      const redisKey = `blog:${blog.id}:reactions`;

      for (let i = 0; i < reactionCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        await redis.sadd(redisKey, randomUser.id.toString());
      }
    }

    await redis.quit();
    console.log('✅ Redis reactions seeded');
  }
}
