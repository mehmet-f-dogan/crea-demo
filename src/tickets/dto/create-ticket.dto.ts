import { IsInt, IsPositive } from 'class-validator';

export class CreateTicketDto {
  @IsPositive()
  @IsInt()
  session_id: number;
}
