import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { Activity } from './entities/activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { TeamModule } from 'src/team/team.module';
import { SignUpActivity } from './entities/user-activity.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, SignUpActivity]),
    UserModule,
    TeamModule,
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
