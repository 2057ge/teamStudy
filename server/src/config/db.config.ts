import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DBConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '2057949245ge',
  database: 'team_study',
  synchronize: true,
  retryAttempts: 10,
  retryDelay: 1000,
  autoLoadEntities: true,
};
