import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity('tokens')
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: number;

    @Column({ type: 'text' })
    refreshTokenHash: string;

    @Column({ type: 'simple-array', nullable: true })
    usedTokens: string[];

    @Column({ type: 'timestamptz' })
    refreshTokenExpiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
