import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import * as svgCaptcha from 'svg-captcha';
import { Response } from 'express';
import { Public } from 'src/auth/auth.guard';
import { ConfigService } from '@nestjs/config';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Req() req) {
    console.log('aa', this.configService.get<string>('user'));
    console.log(req.query);
    return this.userService.findAll({ keyword: req.query.keyword });
  }

  @Get('code')
  @Public()
  createCaptcha(@Req() req, @Res() res: Response) {
    console.log(this.configService.get<string>('DATABASE_USER'));
    console.log('aa', this.configService.get<string>('user'));
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      background: '#cc9966', //背景颜色
    });
    req.session.verify = captcha.text;
    res.type('image/svg+xml');
    res.send(captcha.data);
  }
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
  @Post('verify')
  @Public()
  verifyCode(@Req() req) {
    const text = req.session.verify;
    if (
      req.session.verify?.toLocaleLowerCase() ===
      req.body?.text?.toLocaleLowerCase()
    ) {
      return 200;
    } else return 201;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'public/useravatar/');
        },
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, basename(file.originalname, ext) + '-' + uniqueSuffix);
        },
      }),
      fileFilter(req, file, cb) {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString(
          'utf-8',
        );

        cb(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.avatar = 'useravatar/' + file.filename;
    }
    const res = await this.userService.update(id, updateUserDto);
    if (res) {
      return '更新成功';
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
