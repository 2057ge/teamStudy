import { type } from 'os';
import { User } from 'src/user/entities/user.entity';
import {
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Team } from './team.entity';
type UserRoleType = 'admin' | 'user' | 'creator';
@Entity('join')
export class JoinTeam {
  @ManyToOne((type) => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  @PrimaryColumn()
  userId: string;

  @ManyToOne((type) => Team, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  @PrimaryColumn()
  teamId: number;

  @Column({ type: 'enum', enum: ['admin', 'user', 'creator'], default: 'user' })
  role: UserRoleType;

  @CreateDateColumn({ type: 'timestamp' })
  joinTime: Date;
}
