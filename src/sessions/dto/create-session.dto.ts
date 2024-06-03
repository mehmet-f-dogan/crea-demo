import { ApiProperty } from '@nestjs/swagger';
import { IsDateStringFormat } from '../../shared/isDateStringFormat.decorator';
import { IsIn, IsNotEmpty, IsPositive, IsString } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @IsIn(['10', '12', '14', '16', '18', '20', '22'])
  @ApiProperty({
    enum: ['10', '12', '14', '16', '18', '20', '22'],
    example: '10',
    description: 'Available time slots: 10, 12, 14, 16, 18, 20, 22',
  })
  timeSlot: string;

  @IsPositive()
  roomNumber: number;

  @IsPositive()
  movieId: number;
}
