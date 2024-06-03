import {
  IsArray,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSessionDto } from '../../sessions/dto/create-session.dto';

export class CreateMovieDto {
  @IsString()
  @MinLength(1)
  name: string;
  @Min(0)
  minimumAge: number;
  @IsArray()
  @Type(() => CreateSessionDto)
  @ValidateNested({ each: true })
  sessions: CreateSessionDto[];
}
