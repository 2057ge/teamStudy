import { UUID } from 'crypto';

export class CreateSourceDto {
  fileDir: string;
  userId: UUID;
  teamId: number;
}
