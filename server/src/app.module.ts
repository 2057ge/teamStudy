import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamModule } from './team/team.module';
import { TrendModule } from './trend/trend.module';
import { SourceModule } from './source/source.module';
import { ActivityModule } from './activity/activity.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role/role.guard';
import { DBConfig } from './config/db.config';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(DBConfig),
    TeamModule,
    TrendModule,
    SourceModule,
    ActivityModule,
    AuthModule,
    ConfigModule.forRoot({ envFilePath: 'my.env', load: [config] }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
