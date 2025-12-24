// 02-role.seed.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from 'src/modules/role/entities/role.entity';

export default class RoleSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.getRepository(Role).save([
      { id: 1, name: 'admin' },
      { id: 2, name: 'blogger' },
    ]);
  }
}
