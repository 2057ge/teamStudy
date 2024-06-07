import { Module } from '@nestjs/common';
import { TrendService } from './trend.service';
import { TrendController } from './trend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trend } from './entities/trend.entity';
import { UserModule } from 'src/user/user.module';
import { TeamModule } from 'src/team/team.module';
@Module({
  imports: [TypeOrmModule.forFeature([Trend]), UserModule, TeamModule],
  controllers: [TrendController],
  providers: [TrendService],
})
export class TrendModule {}
