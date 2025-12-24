// 04-category.seed.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Category } from 'src/modules/category/entities/category.entity';

export default class CategorySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Category);

    const categories = [
      {
        name: 'Công nghệ',
        slug: 'cong-nghe',
        description: 'Tin tức, xu hướng và kiến thức tổng quan về công nghệ thông tin.'
      },
      {
        name: 'Lập trình',
        slug: 'lap-trinh',
        description: 'Chia sẻ kiến thức lập trình, thuật toán và kinh nghiệm phát triển phần mềm.'
      },
      {
        name: 'Frontend',
        slug: 'frontend',
        description: 'Phát triển giao diện người dùng với HTML, CSS, JavaScript, React, Next.js.'
      },
      {
        name: 'Backend',
        slug: 'backend',
        description: 'Xây dựng hệ thống server, API, database với Node.js, NestJS, Java, PHP.'
      },
      {
        name: 'DevOps',
        slug: 'devops',
        description: 'CI/CD, Docker, Kubernetes, tối ưu hệ thống và hạ tầng phần mềm.'
      },
      {
        name: 'AI & Machine Learning',
        slug: 'ai-machine-learning',
        description: 'Trí tuệ nhân tạo, machine learning, deep learning và ứng dụng thực tế.'
      },
      {
        name: 'Blockchain',
        slug: 'blockchain',
        description: 'Blockchain, smart contract, Web3, tiền mã hóa và công nghệ phi tập trung.'
      },
      {
        name: 'An ninh mạng',
        slug: 'an-ninh-mang',
        description: 'Bảo mật hệ thống, an toàn thông tin, pentest và phòng chống tấn công mạng.'
      },
      {
        name: 'Mobile App',
        slug: 'mobile-app',
        description: 'Phát triển ứng dụng di động với Flutter, React Native, iOS và Android.'
      },
      {
        name: 'Cloud Computing',
        slug: 'cloud-computing',
        description: 'Điện toán đám mây với AWS, Google Cloud, Azure và kiến trúc cloud.'
      },
    ];

    await repo.save(categories);
  }
}
