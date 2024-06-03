import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { SessionsService } from '../sessions/sessions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateMovieBulkDto } from './dto/create-movie-bulk.dto';
import { FindAllMoviesWithFilterAndSortDto } from './dto/find-all-movies-with-filter-and-sort';
import { UpdateMovieResponseDto } from './dto/update-movie-response.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @Inject(forwardRef(() => SessionsService))
    private sessionsService: SessionsService,
    private dataSource: DataSource,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    let returnError = null;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const movie = this.moviesRepository.create({
      minimumAge: createMovieDto.minimumAge,
      name: createMovieDto.name,
      sessions: [],
    });

    await this.moviesRepository.save(movie);

    try {
      for (const sessionDto of createMovieDto.sessions) {
        const session = await this.sessionsService.create({
          ...sessionDto,
          movieId: movie.id,
        });
        await queryRunner.manager.save(session);
        movie.sessions.push(session);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      returnError = error;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (returnError) {
      throw returnError;
    }

    return await this.moviesRepository.save(movie);
  }

  async createBulk(createMovieBulkDto: CreateMovieBulkDto) {
    let returnError = null;
    let returnMovies: Movie[] = [];

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const movieDto of createMovieBulkDto.movies) {
        const movie = this.moviesRepository.create({
          minimumAge: movieDto.minimumAge,
          name: movieDto.name,
          sessions: [],
        });
        await this.moviesRepository.save(movie);
        for (const sessionDto of movieDto.sessions) {
          const session = await this.sessionsService.create({
            ...sessionDto,
            movieId: movie.id,
          });
          await queryRunner.manager.save(session);
          movie.sessions.push(session);
        }
        returnMovies.push(movie);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      returnError = error;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (returnError) {
      throw returnError;
    }

    return returnMovies;
  }

  async findAllMoviesWithFilterAndSort(
    getMoviesDto: FindAllMoviesWithFilterAndSortDto,
  ) {
    const query = this.moviesRepository.createQueryBuilder('movie');
    const { name, minimumAge, sortBy, sort } = getMoviesDto;
    if (name) {
      query.andWhere('movie.name LIKE :name', { name: `%${name}%` });
    }

    if (minimumAge) {
      query.andWhere('movie.minimumAge = :minimumAge', {
        minimumAge: `%${minimumAge}%`,
      });
    }

    if (sortBy) {
      query.orderBy(`user.${sortBy}`, sort);
    }

    return query.getMany();
  }

  async findOne(id: number, relations: string[]) {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations,
    });
    if (!movie) {
      throw new NotFoundException(`Movie not found with id: ${id}`);
    }
    return movie;
  }

  async update(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<UpdateMovieResponseDto> {
    const movie = await this.findOne(id, []);

    movie.name = updateMovieDto.name || movie.name;
    movie.minimumAge = updateMovieDto.minimumAge || movie.minimumAge;

    const saved = await this.moviesRepository.save(movie);
    return { ...saved };
  }

  async remove(id: number) {
    try {
      const movie = await this.findOne(id, []);
      return await this.moviesRepository.remove(movie);
    } catch (ignored) {}
  }
}
