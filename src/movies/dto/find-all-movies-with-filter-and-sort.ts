import { IsNumber, IsOptional, IsString, IsIn } from 'class-validator';

export class FindAllMoviesWithFilterAndSortDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  minimumAge?: number;

  @IsOptional()
  @IsIn(['name', 'minimumAge', 'id'])
  sortBy?: 'name' | 'minimumAge' | 'id';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort?: 'ASC' | 'DESC';
}
