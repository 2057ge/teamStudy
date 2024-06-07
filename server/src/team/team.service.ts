import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateJoinDte, CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { DataSource, Repository, EntityManager } from 'typeorm';
import { Team } from './entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinTeam } from './entities/join.entity';
import { unprocessableEntityException } from 'src/common/error/unprocessableEntity';
import { Trend } from 'src/trend/entities/trend.entity';
import { TeamSources } from './entities/teamsources.entity';
import { async } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { count } from 'console';
import { Source } from 'src/source/entities/source.entity';
import { userInfo } from 'os';
@Injectable()
export class TeamService {
  constructor(
    private dataSource: DataSource,
    private entityManage: EntityManager,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(JoinTeam) private joinRepository: Repository<JoinTeam>,
  ) {}
  async create(createTeamDto: CreateTeamDto) {
    const team = this.teamRepository.create(createTeamDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const teamE = await queryRunner.manager.save(team);
      const join = new JoinTeam();
      join.role = 'creator';
      join.userId = createTeamDto.userId;
      join.teamId = teamE.id;
      await queryRunner.manager.save(join);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw unprocessableEntityException(e);
    }
    return '添加成功';
  }

  async changeRole(info: any) {
    const join = await this.joinRepository.findOne({
      where: { userId: info.userId, teamId: info.teamId },
    });
    join.role = info.role;

    return await this.joinRepository.update(
      { userId: info.userId, teamId: info.teamId },
      join,
    );
  }

  async createJoin(body: CreateJoinDte) {
    const join = this.joinRepository.create(body);
    join.role = 'user';
    try {
      await this.joinRepository.save(join);
    } catch (e) {
      throw unprocessableEntityException(e);
    }
    return '添加成功';
  }
  async getIsPass(teamId, password) {
    try {
      const res = await this.teamRepository.findOne({ where: { id: teamId } });
      if (!res.password || res.password === password) {
        return true;
      } else return false;
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }
  async findAll({ keyword, currentSize, pageSize }) {
    if (!keyword) keyword = '';
    //console.log(currentSize);
    //console.log(pageSize);v
    let skipNum;
    if (!currentSize) skipNum = 0;
    else skipNum = pageSize * (currentSize - 1);
    if (!pageSize) {
      pageSize = 0x3f3f3f3f;
    }
    const data = await this.teamRepository
      .createQueryBuilder('team')
      .where('team.teamname like :s', { s: '%' + keyword + '%' })
      .orderBy('createTime', 'DESC')
      .skip(skipNum)
      .take(pageSize)
      .getMany();
    const total = await this.teamRepository
      .createQueryBuilder('team')
      .where('team.teamname like :s', { s: '%' + keyword + '%' })
      .orderBy('createTime', 'DESC')
      .getCount();
    return {
      teams: data,
      total,
    };
  }
  async getUser(id: number) {
    try {
      return await this.entityManage
        .createQueryBuilder(User, 'user')
        .innerJoin(JoinTeam, 'join', 'join.userId=user.id')
        .innerJoin(Team, 'team', 'team.id=join.teamId')
        .where('team.id=:id', { id: id })
        .addSelect('join.role', 'role')
        .orderBy('join.joinTime', 'ASC')
        .getRawMany();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  async getCreator(id: number) {
    try {
      await this.entityManage
        .createQueryBuilder(User, 'user')
        .innerJoin(JoinTeam, 'join', 'join.userId = user.id')
        .innerJoin(Team, 'team', 'team.id=join.teamId')
        .where('team.id=:id', { id })
        .andWhere("join.role = 'creator' ")
        .getOne();
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }
  async getJoinedTeam(id: string) {
    const res = await this.teamRepository
      .createQueryBuilder('team')
      .innerJoin(JoinTeam, 'join', 'join.teamId=team.id')
      .innerJoin(User, 'user', 'join.userId=user.id')
      .where('user.id=:id ', { id })
      .andWhere("join.role= 'user' ")
      .getMany();
    for (const item of res) {
      item['creator'] = this.getCreator(item.id);
    }
    return res;
  }
  async getManagedTeam(id: string) {
    const res = await this.teamRepository
      .createQueryBuilder('team')
      .innerJoin(JoinTeam, 'join', 'join.teamId=team.id')
      .innerJoin(User, 'user', 'join.userId=user.id')
      .where('user.id=:id ', { id })
      .andWhere("join.role= 'admin' ")
      .getMany();
    for (const item of res) {
      item['creator'] = this.getCreator(item.id);
    }
    return res;
  }
  async getMyTeam(id: string) {
    return await this.teamRepository
      .createQueryBuilder('team')
      .innerJoin(JoinTeam, 'join', 'join.teamId=team.id')
      .innerJoin(User, 'user', 'join.userId=user.id')
      .where('user.id=:id ', { id })
      .andWhere("join.role = 'creator' ")
      .getMany();
  }
  async findOne(id: number) {
    try {
      return await this.teamRepository.findOne({
        where: { id },
      });
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }
  async findRole(teamId, userId) {
    try {
      return await this.entityManage
        .createQueryBuilder(JoinTeam, 'join')
        .innerJoin(Team, 'team', 'join.teamId=team.id')
        .andWhere('team.id=:teamId', { teamId })
        .innerJoin(User, 'user', 'user.id=join.userId')
        .andWhere('user.id=:userId', { userId })
        .getOne();
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }
  async update(id: number, updateTeamDto: UpdateTeamDto) {
    let team = await this.teamRepository.findOne({ where: { id } });
    team = { ...team, ...updateTeamDto };
    await this.teamRepository.save(team);
    return '更新成功';
  }

  async remove(id: number) {
    try {
      const team = await this.teamRepository.findOne({ where: { id } });

      await this.teamRepository.remove(team);
    } catch (e) {
      throw unprocessableEntityException(e);
    }
    return '删除成功';
  }
  async findOneOfSource(id: number) {
    return await this.entityManage.find(TeamSources, { where: { id } });
  }
}
