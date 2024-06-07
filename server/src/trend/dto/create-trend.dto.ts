import { IsNotEmpty, IsString, IsNumber, isNumber } from 'class-validator';
export class CreateTrendDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  teamId: number;
  files: string;
}
