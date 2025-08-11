import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';

@Entity('tokens') // Đặt tên bảng rõ ràng
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // FK thực tế trong DB
  @Column()
  userId: number;

  @Column({ type: 'text' })
  refreshTokenHash: string;

  @Column({ type: 'simple-array', nullable: true })
  usedTokens: string[]; // Lưu AT/RT đã dùng

  @Column({ type: 'timestamptz' })
  refreshTokenExpiresAt: Date; // Ngày hết hạn RT

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
