import { type } from 'os';
import { Activity } from 'src/activity/entities/activity.entity';
import { Source } from 'src/source/entities/source.entity';
import { Team } from 'src/team/entities/team.entity';
import { Trend } from 'src/trend/entities/trend.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
  ManyToMany,
  OneToMany,
  Index,
  BeforeUpdate,
} from 'typeorm';

type UserGenderType = 'male' | 'woman' | 'unknown';
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  loginId: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: false,
  })
  password: string;

  @Column({ type: 'varchar', length: 4094, nullable: true })
  introduction: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createTime: Date;

  @OneToMany((type) => Trend, (trend) => trend.user)
  trends: Trend[];

  @OneToMany((type) => Source, (source) => source.user)
  sources: Source[];

  @Column({
    type: 'enum',
    enum: ['male', 'woman', 'unknown'],
    default: 'unknown',
  })
  gender: UserGenderType;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @BeforeUpdate()
  whoToupdate() {
    console.log('触发器', this.username);
  }
}
