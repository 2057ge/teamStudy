import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto, CreateJoinDte } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'public/teamcover/');
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
  create(
    @Body() createTeamDto: CreateTeamDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log('team', createTeamDto);
    //console.log(file);

    if (file) {
      createTeamDto.cover = 'teamcover/' + file.filename;
    }
    return this.teamService.create(createTeamDto);
  }

  @Post('/change/role')
  changeRole(@Body() info: any) {
    return this.teamService.changeRole(info);
  }

  @Post('/jointeam')
  creatJoin(@Body() joinData: CreateJoinDte) {
    return this.teamService.createJoin(joinData);
  }

  @Get('pass')
  getIsPass(@Query() query) {
    return this.teamService.getIsPass(query.teamId, query.password);
  }
  @Get()
  findAll(@Query() query) {
    return this.teamService.findAll({
      keyword: query.keyword,
      currentSize: query.currentSize,
      pageSize: query.pageSize,
    });
  }
  @Get('/user/:id')
  getUser(@Param('id') id: number) {
    return this.teamService.getUser(id);
  }

  @Get('/user/joined/:id')
  getJoinedTeam(@Param('id') id: string) {
    return this.teamService.getJoinedTeam(id);
  }
  @Get('/user/managed/:id')
  getManagedTeam(@Param('id') id: string) {
    return this.teamService.getManagedTeam(id);
  }
  @Get('/user/myteam/:id')
  getMyTeam(@Param('id') id: string) {
    return this.teamService.getMyTeam(id);
  }
  @Get('role')
  findRole(@Query() query) {
    return this.teamService.findRole(query.teamId, query.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Get('source/:id')
  findOneOfSource(@Param('id') id: number) {
    return this.teamService.findOneOfSource(+id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.teamService.remove(id);
  }
}
