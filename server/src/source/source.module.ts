import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';
import { UserModule } from 'src/user/user.module';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [TypeOrmModule.forFeature([Source]), UserModule, TeamModule],
  controllers: [SourceController],
  providers: [SourceService],
})
export class SourceModule {}
