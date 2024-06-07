import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import { unprocessableEntityException } from 'src/common/error/unprocessableEntity';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(Source) private sourceRepository: Repository<Source>,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private entityManage: EntityManager,
  ) {}
  async create(createSourceDto: CreateSourceDto) {
    const source = this.sourceRepository.create(createSourceDto);
    try {
      const flg1 = await this.teamRepository.exist({
        where: { id: createSourceDto.teamId },
      });
      const flg2 = await this.userRepository.exist({
        where: { id: createSourceDto.userId },
      });
      if (!(flg1 && flg2)) {
        throw new Error('不存在用户或者团队');
      }
      const s = await this.sourceRepository.save(source);
      await this.userRepository
        .createQueryBuilder()
        .relation('sources')
        .of(createSourceDto.userId)
        .add(s);
      await this.teamRepository
        .createQueryBuilder()
        .relation('sources')
        .of(createSourceDto.teamId)
        .add(s);
      await this.sourceRepository
        .createQueryBuilder()
        .relation('user')
        .of(s)
        .set(createSourceDto.userId);
      await this.sourceRepository
        .createQueryBuilder()
        .relation('team')
        .of(s)
        .set(createSourceDto.teamId);
    } catch (e) {
      throw unprocessableEntityException(e);
    }
    return '添加成功';
  }

  async findAll(filename) {
    if (!filename) filename = '';
    return await this.sourceRepository.find({
      where: { filename: Like('%' + filename + '%') },
      take: 500,
      order: { publishTime: 'ASC' },
    });
  }

  async findTeamOfSource(id: number, keyword: string) {
    if (!keyword) keyword = '';
    try {
      return await this.entityManage
        .createQueryBuilder(Source, 'source')
        .innerJoin(Team, 'team', 'team.id=source.team')
        .andWhere('team.id=:id', { id: id })
        .innerJoinAndMapOne(
          'source.creator',
          User,
          'user',
          'user.id=source.user',
        )
        .andWhere('source.filename like :s', { s: '%' + keyword + '%' })
        .orderBy('publishTime', 'DESC')
        .getMany();
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }
  async findOne(id: number) {
    return await this.sourceRepository.findOne({ where: { id } });
  }

  async update(id: number, updateSourceDto: UpdateSourceDto) {
    let s = await this.sourceRepository.findOne({ where: { id } });
    s = { ...s, ...updateSourceDto };
    await this.sourceRepository.save(s);
    return '更新成功';
  }

  async remove(id: number) {
    const s = await this.sourceRepository.findOne({ where: { id } });
    await this.sourceRepository.remove(s);
    return '删除成功';
  }
}
