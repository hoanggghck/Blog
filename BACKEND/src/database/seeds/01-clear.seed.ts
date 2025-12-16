// 01-clear.seed.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class ClearDatabaseSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const tables = [
      'blogs',
      'users',
      'roles',
      'categories',
      'tags',
    ];

    for (const table of tables) {
      await dataSource.query(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`,
      );
    }
  }
}
