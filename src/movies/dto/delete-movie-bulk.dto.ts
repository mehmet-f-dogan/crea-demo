import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteMovieBulkDto {
  @IsArray()
  @Type(() => Number)
  ids: number[];
}
