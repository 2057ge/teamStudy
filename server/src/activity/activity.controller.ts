import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { query } from 'express';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }
  @Roles(Role.User)
  @Post('signup')
  signUp(@Body() signUpInfo: any) {
    return this.activityService.signup(signUpInfo);
  }
  @Get()
  findAll(@Query() query) {
    return this.activityService.findAll(query.keyword);
  }
  @Get('/team/:id')
  findTeamOfActivities(@Param('id') id: number, @Query() query) {
    return this.activityService.findTeamOfActivities(id, query.userId);
  }
  @Get(':id')
  findOne(@Param('id') id: number, @Query() query) {
    return this.activityService.findOne(+id, query.userId);
  }
  @Roles(Role.User)
  @Get('/issign')
  isSign(@Query() query) {
    console.log(query);
  }
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activityService.update(+id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.remove(+id);
  }
}
