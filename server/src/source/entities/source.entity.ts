import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';

@Entity('source')
export class Source {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  fileDir: string;

  @Column({ type: 'bigint', default: 0 })
  size: number;

  @Column({ type: 'int', default: 0 })
  downloads: number;

  @CreateDateColumn({ type: 'timestamp' })
  publishTime: Date;

  @ManyToOne((type) => User, (user) => user.sources, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne((type) => Team, (team) => team.sources, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  team: Team;
}
