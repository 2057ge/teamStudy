import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, EntityManager } from 'typeorm';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { SignUpActivity } from './entities/user-activity.entity';
import { unprocessableEntityException } from 'src/common/error/unprocessableEntity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(SignUpActivity)
    private signUp: Repository<SignUpActivity>,
    private entityManger: EntityManager,
  ) {}
  async create(createActivityDto: CreateActivityDto) {
    const a = this.activityRepository.create(createActivityDto);
    const b = this.signUp.create(createActivityDto);
    b.role = 'creator';
    try {
      const userId = createActivityDto.userId;
      const teamId = createActivityDto.teamId;
      const flg1 = await this.userRepository.exist({ where: { id: userId } });
      const flg2 = await this.teamRepository.exist({ where: { id: teamId } });
      if (!(flg1 && flg2)) {
        throw new Error('不存在用户或者团队');
      }
      const aE = await this.activityRepository.save(a);
      b.activityId = aE.id;
      await this.signUp.save(b);
      await this.teamRepository
        .createQueryBuilder()
        .relation('activities')
        .of(teamId)
        .add(aE);
      await this.activityRepository
        .createQueryBuilder()
        .relation('team')
        .of(aE)
        .set(teamId);
    } catch (e) {
      throw unprocessableEntityException(e);
    }
    return '添加成功';
  }

  async signup(signUpInfo) {
    try {
      const a = this.entityManger.create(SignUpActivity, signUpInfo);
      return await this.entityManger.save(SignUpActivity, a);
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }
  async findAll(title) {
    if (!title) title = '';
    return await this.activityRepository.find({
      order: { publishTime: 'DESC' },
      where: { title: Like('%' + title + '%') },
      take: 500,
    });
  }

  async findOne(id: number, userId) {
    try {
      const res = await this.entityManger
        .createQueryBuilder(Activity, 'activity')
        .andWhere('activity.id=:id', { id })
        .getOne();

      res['creator'] = await this.findCreator(res.id);
      res['enrollment'] = await this.getNumber(res.id);
      res['exist'] = await this.isExists(res.id, userId);

      return res;
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async findCreator(id: number) {
    return await this.entityManger
      .createQueryBuilder(User, 'user')
      .innerJoin(SignUpActivity, 'signUp', 'signUp.userId=user.id')
      .andWhere('signUp.activityId=:id', { id: id })
      .andWhere("signUp.role= 'creator'")
      .getOne();
  }
  async getNumber(id: number) {
    return await this.entityManger
      .createQueryBuilder(User, 'user')
      .innerJoin(SignUpActivity, 'signUp', 'signUp.UserId=user.id')
      .andWhere('signUp.activityId=:id', { id })
      .getCount();
  }
  async isExists(id: number, userId: string) {
    return await await this.entityManger
      .createQueryBuilder(User, 'user')
      .andWhere('user.id=:userId', { userId })
      .innerJoin(SignUpActivity, 'signUp', 'signUp.UserId=user.id')
      .andWhere('signUp.activityId=:id', { id })
      .getExists();
  }
  async findTeamOfActivities(id: number, userId: string) {
    try {
      const res = await this.entityManger
        .createQueryBuilder(Activity, 'activity')
        .innerJoin(Team, 'team', 'activity.team=team.id')
        .andWhere('team.id=:id', { id })
        .orderBy('activity.publishTime', 'DESC')
        .getMany();
      for (const item of res) {
        item['creator'] = await this.findCreator(item.id);
        item['enrollment'] = await this.getNumber(item.id);
        item['exist'] = await this.isExists(item.id, userId);
      }
      return res;
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }
  async update(id: number, updateActivityDto: UpdateActivityDto) {
    const a = await this.activityRepository.findOne({ where: { id } });
    await this.activityRepository.save(a);
    return '更新成功';
  }

  async remove(id: number) {
    const a = await this.activityRepository.findOne({ where: { id } });
    await this.activityRepository.remove(a);
    return '删除成功';
  }
}
