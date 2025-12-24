// 01-clear.seed.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import Redis from 'ioredis';

export default class ClearDatabaseSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });
    await redis.flushall();
    await redis.quit();
    const tables = [
      'blogs',
      'users',
      'roles',
      'categories',
      'tags',
      'comments'
    ];

    for (const table of tables) {
      await dataSource.query(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`,
      );
    }
  }
}
