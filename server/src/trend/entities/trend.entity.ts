import { type } from 'os';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
} from 'typeorm';
@Entity('trend')
export class Trend {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  publishTime: Date;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'varchar', name: 'files', length: 1023 })
  files: string;

  @ManyToOne((type) => User, (user) => user.trends, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne((type) => Team, (team) => team.trends, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  team: Team;
}
