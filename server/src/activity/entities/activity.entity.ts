import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
@Entity('activity')
export class Activity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  @Column({ type: 'varchar', length: 4094 })
  content: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @CreateDateColumn({ type: 'timestamp' })
  publishTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @ManyToOne((type) => Team, (team) => team.activities, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  team: Team;
}
