import { ApiProperty } from '@nestjs/swagger';
import { IsDateStringFormat } from '../../shared/isDateStringFormat.decorator';
import { TimeSlot } from '../entities/session.entity';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsDateStringFormat('dd.MM.yyyy', {
    message: 'Date must be in the format dd.MM.yyyy',
  })
  @ApiProperty({
    example: '30.12.2024',
    pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
  })
  date: string;

  @IsNotEmpty()
  timeSlot: TimeSlot;

  @IsPositive()
  roomNumber: number;

  @IsPositive()
  movieId: number;
}
