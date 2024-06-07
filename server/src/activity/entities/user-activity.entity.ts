import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
type ActivityRole = 'participator' | 'creator';
@Entity('sign_up_activity')
export class SignUpActivity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'varchar', length: 36, name: 'userId' })
  userId: string;

  @Column({ type: 'int', name: 'activityId' })
  activityId: number;

  @Column({
    type: 'enum',
    enum: ['participator', 'creator'],
    default: 'participator',
  })
  role: ActivityRole;
}
