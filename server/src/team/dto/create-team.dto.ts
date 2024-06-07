import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { UUID } from 'crypto';
export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  teamname: string;

  @IsString()
  introduction: string;

  @IsNotEmpty()
  userId: UUID;
  @IsString()
  cover: string;
}
export class CreateJoinDte {
  @IsNotEmpty()
  @IsNumber()
  teamId: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
