import { Exclude } from 'class-transformer';
import { Image } from 'src/modules/image/entities/image.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column({ type: 'varchar', nullable: true })
    passwordHash: string | null;

    @Column({ nullable: true })
    avatarUrl?: string;

    @Column({ nullable: true })
    roleId: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => Image, { nullable: true, cascade: true })
    @JoinColumn()
    avatar?: Image; 
}
