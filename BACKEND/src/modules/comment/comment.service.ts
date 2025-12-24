import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,

        @InjectRepository(Blog)
        private readonly blogRepo: Repository<Blog>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async create(dto: CreateCommentDto, userId: number) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) {
        throw new NotFoundException('Không tìm thấy user');
        }

        const blog = await this.blogRepo.findOneBy({ id: dto.blogId })

        if (!blog) {
        throw new NotFoundException('Không tìm thấy blog');
        }

        const comment = this.commentRepo.create({
            content: dto.content,
            blogId: dto.blogId,
            blog,
            userId: user.id,
            user,
        });

        return this.commentRepo.save(comment);
    }

    /* ================= READ ================= */
    async getCommentsByBlogId(blogId: number) {
        return this.commentRepo
            .createQueryBuilder('comment')
            .leftJoin('comment.user', 'user')
            .where('comment.blogId = :blogId', { blogId })
            .select([
                'comment.id',
                'comment.content',
                'comment.createdAt',
                'user.id',
                'user.name',
                'user.avatar',
            ])
            .orderBy('comment.createdAt', 'DESC')
            .getMany();
    }

    /* ================= UPDATE ================= */
    async update(id: number, dto: UpdateCommentDto, user: User) {
        const comment = await this.commentRepo.findOne({
        where: { id },
        });

        if (!comment) {
        throw new NotFoundException('Không tìm thấy comment');
        }

        if (comment.userId !== user.id) {
        throw new NotFoundException('Không thể cập nhật comment của người khác');
        }

        if (dto.content !== undefined) {
        comment.content = dto.content;
        }

        return this.commentRepo.save(comment);
    }

    /* ================= DELETE ================= */
    async remove(id: number, user: User) {
        const comment = await this.commentRepo.findOne({
        where: { id },
        });

        if (!comment) {
        throw new NotFoundException('không tìm thấy comment');
        }

        if (comment.userId !== user.id) {
        throw new NotFoundException('Không thể xóa comment của người khác');
        }

        return this.commentRepo.remove(comment);
    }
}
