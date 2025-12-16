// 04-category.seed.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Category } from 'src/modules/category/entities/category.entity';

export default class CategorySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Category);

    const categories = [
      { name: 'Công nghệ', slug: 'cong-nghe' },
      { name: 'Lập trình', slug: 'lap-trinh' },
      { name: 'Frontend', slug: 'frontend' },
      { name: 'Backend', slug: 'backend' },
      { name: 'DevOps', slug: 'devops' },
      { name: 'AI & Machine Learning', slug: 'ai-machine-learning' },
      { name: 'Blockchain', slug: 'blockchain' },
      { name: 'An ninh mạng', slug: 'an-ninh-mang' },
      { name: 'Mobile App', slug: 'mobile-app' },
      { name: 'Cloud Computing', slug: 'cloud-computing' },
    ];

    await repo.save(categories);
  }
}
