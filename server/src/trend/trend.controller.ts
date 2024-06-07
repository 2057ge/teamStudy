import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Req,
  Res,
} from '@nestjs/common';
import { TrendService } from './trend.service';
import { CreateTrendDto } from './dto/create-trend.dto';
import { UpdateTrendDto } from './dto/update-trend.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, dirname, extname, join } from 'path';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { Response } from 'express';
@Controller('trend')
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

  @Roles(Role.User)
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'public/trend/');
        },
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, basename(file.originalname, ext) + '-' + uniqueSuffix + ext);
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
    @Body() createTrendDto: CreateTrendDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(files);
    let k = 0;
    createTrendDto.files = '';

    for (const item of files) {
      if (k++) {
        createTrendDto.files += '<breakpoint>';
      }
      createTrendDto.files += item.path;
    }

    return this.trendService.create(createTrendDto);
  }

  @Roles(Role.Admin, Role.Creator)
  @Post('uploadFile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'public/trendimg/');
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
  getFile(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  @Get()
  findAll(@Query() query) {
    return this.trendService.findAll(query.keyword);
  }
  @Get('export')
  async download(@Req() req, @Res() res: Response) {
    const query = req.query;

    console.log(query);
    console.log(join(dirname('public'), query.filePath));
    res.download(join(dirname('public'), query.filePath));
  }
  @Get('top/:id')
  findTop(@Param('id') id: number) {
    return this.trendService.findTop(id);
  }

  @Get('team/:id')
  findTeamOfTrends(@Param('id') id: number) {
    return this.trendService.findTeamOfTrends(id);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.trendService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTrendDto: UpdateTrendDto) {
    return this.trendService.update(id, updateTrendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.trendService.remove(+id);
  }
}
