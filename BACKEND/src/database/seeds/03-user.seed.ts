import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/role/entities/role.entity';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);

    const adminRole = await roleRepo.findOneBy({ id: 1 });
    const bloggerRole = await roleRepo.findOneBy({ id: 2 });

    if (!adminRole || !bloggerRole) {
      throw new Error('Roles chưa tồn tại. Hãy chạy RoleSeeder trước.');
    }

    const passwordHash = await bcrypt.hash('123456', 10);

    await userRepo.save({
      name: 'admin',
      email: 'admin@test.com',
      passwordHash,
      role: adminRole,
    });

    const bloggers = [
      'john',
      'michael',
      'david',
      'james',
      'robert',
      'william',
      'daniel',
      'joseph',
      'thomas',
      'charles',
      'christopher',
      'andrew',
      'joshua',
      'ryan',
      'nathan',
      'kevin',
      'brian',
      'eric',
      'steven',
      'adam',
    ];

    const bloggerUsers = bloggers.map((name) => ({
      name,
      email: `${name}@test.com`,
      passwordHash,
      role: bloggerRole,
    }));

    await userRepo.save(bloggerUsers);
  }
}
