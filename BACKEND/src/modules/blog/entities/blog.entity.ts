import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { BlogStatus } from '../enums/blog-status.enum';
import { Image } from 'src/modules/image/entities/image.entity';
import { Category } from 'src/modules/category/entities/category.entity';

  @Entity('blogs')
  export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column({ unique: true, length: 255 })
    slug: string;

    @Column('text')
    content: string;

    @Column({ nullable: true })
    thumbnailId?: number;
  
    @OneToOne(() => Image, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'thumbnailId' })
    thumbnail?: Image | null;

    @Column()
    authorId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'authorId' })
    author: User;

    @Column()
    categoryId: number;

    @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    tagId: number;

    @ManyToOne(() => Tag, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'tagId' })
    tag: Tag;

    @Column({
      type: 'enum',
      enum: BlogStatus,
      default: BlogStatus.DRAFT
    })
    status: BlogStatus;

    @Column({ type: 'timestamp', nullable: true })
    publishedAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
  }
