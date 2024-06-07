import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateTrendDto } from './dto/create-trend.dto';
import { UpdateTrendDto } from './dto/update-trend.dto';
import { Like, Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Trend } from './entities/trend.entity';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { unprocessableEntityException } from 'src/common/error/unprocessableEntity';
@Injectable()
export class TrendService {
  constructor(
    private dataSource: DataSource,
    private entityManager: EntityManager,
    @InjectRepository(Trend) private trendRepository: Repository<Trend>,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createTrendDto: CreateTrendDto) {
    //const queryRunner = this.dataSource.createQueryRunner();

    //await queryRunner.connect();
    //await queryRunner.startTransaction();
    try {
      const flg1 = await this.userRepository.exist({
        where: { id: createTrendDto.userId },
      });
      const flg2 = await this.teamRepository.exist({
        where: { id: createTrendDto.teamId },
      });

      if (!(flg1 && flg2)) {
        throw new Error('不存在相应的团队id或用户id');
      }
      const trend = this.trendRepository.create(createTrendDto);
      const trendE = await this.trendRepository.save(trend);
      await this.trendRepository
        .createQueryBuilder()
        .relation(Trend, 'user')
        .of(trendE)
        .set(createTrendDto.userId);
      await this.trendRepository
        .createQueryBuilder()
        .relation(Trend, 'team')
        .of(trendE)
        .set(createTrendDto.teamId);
      await this.teamRepository
        .createQueryBuilder('team')
        .relation(Team, 'trends')
        .of(createTrendDto.teamId)
        .add(trendE);
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'trends')
        .of(createTrendDto.userId)
        .add(trendE);
    } catch (e) {
      throw unprocessableEntityException(e);
    }
    return '添加成功';
  }

  findAll(title) {
    if (!title) title = '';
    return this.trendRepository.find({
      relations: ['user', 'team'],
      where: { title: Like('%' + title + '%') },
      order: { publishTime: 'DESC' },
      take: 500,
    });
  }
  async findTop(id: number) {
    try {
      return await this.trendRepository
        .createQueryBuilder('trend')
        .innerJoin(Team, 'team', 'team.id=trend.team')
        .andWhere('team.id=:id', { id })
        .orderBy('trend.publishTime', 'DESC')
        .take(12)
        .getMany();
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }
  async findTeamOfTrends(id: number) {
    try {
      return await this.entityManager
        .createQueryBuilder(Trend, 'trend')
        .innerJoin(Team, 'team', 'trend.teamId=team.id')
        .andWhere('team.id=:id', { id: id })
        .innerJoinAndMapOne(
          'trend.creator',
          User,
          'user',
          'user.id=trend.userId',
        )
        .orderBy('trend.publishTime', 'DESC')
        .getMany();
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }
  async findOne(id: number) {
    try {
      return await this.trendRepository.findOne({ where: { id } });
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async update(id: number, updateTrendDto: UpdateTrendDto) {
    const trend = await this.trendRepository.findOne({ where: { id } });
    trend.views++;
    this.trendRepository.save(trend);
    return '更新成功';
  }

  async remove(id: number) {
    const trend = await this.trendRepository.findOne({ where: { id } });
    this.trendRepository.remove(trend);
    return '删除成功';
  }
}
