import { UUID } from 'crypto';

export class CreateActivityDto {
  content: string;

  title: string;

  startTime: Date;

  endTime: Date;

  userId: UUID;

  teamId: number;
}
