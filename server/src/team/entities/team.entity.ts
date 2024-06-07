import { type } from 'os';
import { Activity } from 'src/activity/entities/activity.entity';
import { Source } from 'src/source/entities/source.entity';
import { Trend } from 'src/trend/entities/trend.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToMany,
  JoinTable,
  OneToMany,
  Index,
  Unique,
} from 'typeorm';
@Entity()
export class Team {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  teamname: string;

  @Column({ type: 'varchar', nullable: true, length: 4094 })
  introduction: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  cover: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;

  @OneToMany((type) => Trend, (trend) => trend.team)
  trends: Trend[];

  @OneToMany((type) => Source, (source) => source.team)
  sources: Source[];

  @OneToMany((type) => Activity, (activity) => activity.team)
  activities: Activity[];
}
