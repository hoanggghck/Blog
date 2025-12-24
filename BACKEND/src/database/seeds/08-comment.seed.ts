// 08-comment.seed.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';

export default class CommentSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {

    const blogRepo = dataSource.getRepository(Blog);
    const userRepo = dataSource.getRepository(User);
    const commentRepo = dataSource.getRepository(Comment);

    const blogs = await blogRepo.find({ select: ['id'] });
    const users = await userRepo.find({ select: ['id'] });

    if (!blogs.length || !users.length) {
      console.warn('⚠️ Blogs or Users not found');
      return;
    }

    /* ===================== COMMENT POOL ===================== */
    const commentPool = [
      'Bài viết rất hay và dễ hiểu.',
      'Nội dung này giúp mình hiểu rõ hơn.',
      'Cảm ơn bạn đã chia sẻ kiến thức.',
      'Bài viết rất chi tiết và hữu ích.',
      'Mình học được nhiều điều từ bài này.',
      'Giải thích rất rõ ràng và dễ theo dõi.',
      'Thông tin trong bài khá đầy đủ.',
      'Bài viết đúng thứ mình đang tìm.',
      'Cách trình bày rất mạch lạc.',
      'Đọc xong là hiểu ngay.',
      'Nội dung đơn giản nhưng rất hiệu quả.',
      'Bài viết khá là hữu ích.',
      'Cảm ơn tác giả vì bài viết này.',
      'Mình thấy bài này rất dễ áp dụng.',
      'Giải thích ngắn gọn và súc tích.',
      'Nội dung phù hợp cho người mới.',
      'Bài viết viết rất dễ hiểu.',
      'Thông tin trong bài rất thực tế.',
      'Đọc rất cuốn và không bị lan man.',
      'Bài này giúp mình giải quyết được vấn đề.',
      'Cảm ơn vì đã chia sẻ kinh nghiệm.',
      'Mình sẽ theo dõi thêm các bài khác.',
      'Bài viết khá chi tiết.',
      'Nội dung rất rõ ràng.',
      'Cách giải thích rất hợp lý.',
      'Mình thấy bài này khá hay.',
      'Bài viết có nhiều thông tin hữu ích.',
      'Đọc xong thấy hiểu vấn đề hơn.',
      'Cảm ơn bài viết rất chất lượng.',
      'Bài này rất đáng để tham khảo.',
      'Nội dung dễ đọc và dễ hiểu.',
      'Bài viết không quá dài nhưng đủ ý.',
      'Mình thấy bài này rất ổn.',
      'Giải thích rất trực quan.',
      'Nội dung rất phù hợp với mình.',
      'Bài viết khá đầy đủ và chi tiết.',
      'Mình học được thêm nhiều kiến thức mới.',
      'Cách trình bày rất dễ theo dõi.',
      'Bài viết rất phù hợp cho người mới.',
      'Nội dung được trình bày rõ ràng.',
      'Cảm ơn vì bài viết hữu ích.',
      'Bài viết mang lại nhiều giá trị.',
      'Thông tin trong bài rất dễ hiểu.',
      'Mình thấy bài này rất thực tế.',
      'Đọc bài này thấy rất bổ ích.',
      'Nội dung đúng trọng tâm.',
      'Bài viết có nhiều điểm hay.',
      'Cảm ơn tác giả đã chia sẻ.',
      'Bài này giúp mình hiểu rõ hơn.',
      'Nội dung rất dễ tiếp cận.',
    ];


    const MIN_COMMENTS = 1;
    const MAX_COMMENTS = 5;

    for (const blog of blogs) {
      const commentCount =
        Math.floor(
          Math.random() * (MAX_COMMENTS - MIN_COMMENTS + 1),
        ) + MIN_COMMENTS;

      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      const selectedUsers = shuffledUsers.slice(0, commentCount);

      for (let i = 0; i < commentCount; i++) {
        const randomContent =
          commentPool[
            Math.floor(Math.random() * commentPool.length)
          ];

        await commentRepo.save({
          blogId: blog.id,
          userId: selectedUsers[i].id,
          content: randomContent,
        });
      }
    }

    console.log('✅ Comments seeded');
  }
}
