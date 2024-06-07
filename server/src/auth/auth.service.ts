import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(loginId: string, password: string): Promise<any> {
    const user = await this.userService.findOneByLoginId(loginId);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    //const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    const payload = { loginId: loginId, userId: user.id };
    return await this.jwtService.signAsync(payload);
  }
}
