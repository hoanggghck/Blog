import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Tag } from 'src/modules/tag/entities/tag.entity';

export default class TagSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Tag);

    const tags = [
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'ReactJS', slug: 'reactjs' },
      { name: 'VueJS', slug: 'vuejs' },
      { name: 'NestJS', slug: 'nestjs' },
      { name: 'NodeJS', slug: 'nodejs' },
      { name: 'Docker', slug: 'docker' },
      { name: 'PostgreSQL', slug: 'postgresql' },
      { name: 'DevOps', slug: 'devops' },
      { name: 'AI', slug: 'ai' },
    ];

    await repo.save(tags);
  }
}
