import { IsArray, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSessionDto } from 'src/sessions/dto/create-session.dto';

export class CreateMovieDto {
  @IsString()
  @MinLength(1)
  name: string;
  @Min(0)
  minimumAge: number;
  @IsArray()
  @Type(() => CreateSessionDto)
  sessions: CreateSessionDto[];
}
