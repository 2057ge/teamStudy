import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Team } from './entities/team.entity';
import { JoinTeam } from './entities/join.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { TeamSources } from './entities/teamsources.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Team, JoinTeam, TeamSources])],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TypeOrmModule],
})
export class TeamModule {}
