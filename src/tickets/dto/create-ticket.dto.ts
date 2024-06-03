import { IsInt, IsPositive } from 'class-validator';

export class CreateTicketDto {
  @IsPositive()
  @IsInt()
  sessionId: number;
}
