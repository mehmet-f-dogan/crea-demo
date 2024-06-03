import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMovieDto } from './create-movie.dto';

export class CreateMovieBulkDto {
  @IsArray()
  @Type(() => CreateMovieDto)
  movies: CreateMovieDto[];
}
