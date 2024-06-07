import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { SourceService } from './source.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { basename, dirname, extname, join } from 'path';
import { Response, query } from 'express';
import { arrayBuffer } from 'stream/consumers';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'public/source/');
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
    @Body() createSourceDto: CreateSourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createSourceDto.fileDir = 'source/' + file.filename;
    }
    return this.sourceService.create(createSourceDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.sourceService.findAll(query.keyword);
  }
  @Roles(Role.User, Role.Admin, Role.Creator)
  @Get('export')
  async download(@Req() req, @Res() res: Response) {
    const query = req.query;
    const source = await this.sourceService.findOne(+query.id);

    res.download(
      join(dirname('public'), '/public', source.fileDir),
      Buffer.from(source.filename).toString('utf-8'),
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sourceService.findOne(+id);
  }
  @Roles(Role.User, Role.Admin, Role.Creator)
  @Get('/team/:id')
  findTeamOfSource(@Param('id') id: number, @Query() query) {
    return this.sourceService.findTeamOfSource(id, query.keyword);
  }
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSourceDto: UpdateSourceDto) {
    return this.sourceService.update(id, updateSourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.sourceService.remove(+id);
  }
}
