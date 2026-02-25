// 06-blog.seed.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';

import blogData from './blog-content.seed.json';
import { BlogStatus } from 'src/modules/blog/enums/blog-status.enum';

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default class BlogSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const blogRepo = dataSource.getRepository(Blog);

    const users = await dataSource.getRepository(User).find();
    const categories = await dataSource.getRepository(Category).find();
    const tags = await dataSource.getRepository(Tag).find();

    if (!users.length || !categories.length || !tags.length) {
      throw new Error('Missing users / categories / tags for BlogSeeder');
    }

    const blogs: Blog[] = [];

    for (const item of blogData.data) {
      const blog = blogRepo.create({
        title: item.title,
        slug: `${slugify(item.title)}`,
        content: item.content,
        thumbnail: item.image,
        author: randomItem(users),
        category: randomItem(categories),
        tag: randomItem(tags),
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(),
      });

      blogs.push(blog);
    }

    await blogRepo.save(blogs);
  }
}
