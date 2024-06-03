import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/role.decorator';
import { Role } from '../roles/role.enum';
import { DeleteMovieBulkDto } from './dto/delete-movie-bulk.dto';
import { CreateMovieBulkDto } from './dto/create-movie-bulk.dto';
import { FindAllMoviesWithFilterAndSortDto } from './dto/find-all-movies-with-filter-and-sort';

@Controller('movies')
@ApiTags('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Roles(Role.Moderator)
  @ApiBearerAuth('access-token')
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Post('bulk')
  @Roles(Role.Moderator)
  @ApiBearerAuth('access-token')
  createBulk(@Body() createMovieBulkDto: CreateMovieBulkDto) {
    return this.moviesService.createBulk(createMovieBulkDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  findAll(@Query() getMoviesDto: FindAllMoviesWithFilterAndSortDto) {
    return this.moviesService.findAllMoviesWithFilterAndSort(getMoviesDto);
  }

  @Patch(':id')
  @Roles(Role.Moderator)
  @ApiBearerAuth('access-token')
  update(@Param('id') id: number, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete('bulk')
  @Roles(Role.Moderator)
  @ApiBearerAuth('access-token')
  removeBulk(@Body() deleteMovieBulk: DeleteMovieBulkDto) {
    for (const id of deleteMovieBulk.ids) {
      this.moviesService.remove(id);
    }
  }

  @Delete(':id')
  @Roles(Role.Moderator)
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: number) {
    return this.moviesService.remove(+id);
  }
}
