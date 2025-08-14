import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

}
