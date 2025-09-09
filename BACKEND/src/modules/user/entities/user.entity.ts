import { Exclude } from 'class-transformer';
import { Image } from 'src/modules/image/entities/image.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

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

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 1 })
    status: 1 | 2 | 3; // 1: normal, 2: banned, 3: deleted 

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => Image, { nullable: true, cascade: true })
    @JoinColumn()
    avatar?: Image;

    @ManyToOne(() => Role, { eager: true })
    @JoinColumn({ name: "roleId" })
    role: Role;
}
