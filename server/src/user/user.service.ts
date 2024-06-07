import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JoinTeam } from 'src/team/entities/join.entity';
import { Team } from 'src/team/entities/team.entity';
import { Repository } from 'typeorm';
import { unprocessableEntityException } from 'src/common/error/unprocessableEntity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(JoinTeam) private joinRepository: Repository<JoinTeam>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { loginId: createUserDto.loginId },
    });
    if (user) {
      throw new NotAcceptableException('账号重复');
    }
    const result = await this.userRepository.create(createUserDto);
    try {
      return await this.userRepository.save(result);
    } catch (e) {
      throw unprocessableEntityException(e);
    }
  }

  async findAll({ keyword }) {
    if (!keyword) keyword = '';
    const res2: any = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username like :name  ', { name: '%' + keyword + '%' })
      .leftJoinAndMapMany(
        'user.joins',
        JoinTeam,
        'join',
        'join.userId = user.id',
      )
      .leftJoinAndMapMany('user.teams', Team, 'team', 'join.teamId = team.id')
      .orderBy('user.createTime', 'DESC')
      .limit(500)
      .getMany();
    return res2;
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }
  async findOneByLoginId(loginId: string) {
    return await this.userRepository.findOne({
      where: { loginId },
      select: ['id', 'password', 'loginId', 'username'],
    });
  }
  async update(id: any, updateUserDto: UpdateUserDto) {
    const user = this.userRepository.create(updateUserDto);
    try {
      return await this.userRepository.update({ id }, user);
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async remove(id: any) {
    console.log(id);
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (user) return this.userRepository.remove(user);
    } catch (e) {
      throw unprocessableEntityException(e);
    }
  }
}
