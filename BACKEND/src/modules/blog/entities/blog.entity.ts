import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm';

import { User } from 'src/modules/user/entities/user.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { BlogStatus } from '../enums/blog-status.enum';

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
    thumbnailUrl?: string;

    @Column()
    authorId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'authorId' })
    author: User;

    @Column()
    categoryId: number;

    @ManyToOne(() => Tag)
    @JoinColumn({ name: 'categoryId' })
    category: Tag;

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
