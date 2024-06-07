import { ViewEntity, Entity, ViewColumn } from 'typeorm';

import { Source } from 'src/source/entities/source.entity';
import { Team } from 'src/team/entities/team.entity';
@ViewEntity({
  expression: (connection) =>
    connection
      .createQueryBuilder()
      .select('team.id', 'id')
      .addSelect('source.filename', 'filename')
      .addSelect('source.fileDir', 'fileDir')
      .addSelect('team.teamname', 'teamname')
      .from(Team, 'team')
      .innerJoin(Source, 'source', 'team.id = source.teamId'),
})
export class TeamSources {
  @ViewColumn()
  id: number;
  @ViewColumn()
  filename: string;

  @ViewColumn()
  teamname: string;

  @ViewColumn()
  fileDir: string;
}
