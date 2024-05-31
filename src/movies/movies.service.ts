import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private sessionsService: SessionsService,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const sessions = await Promise.all(
      createMovieDto.sessions.map((sessionDto) =>
        this.sessionsService.create(sessionDto),
      ),
    );

    const movie = this.moviesRepository.create({
      minimumAge: createMovieDto.minimumAge,
      name: createMovieDto.name,
      sessions,
    });

    return await this.moviesRepository.save(movie);
  }

  async findAll() {
    return await this.moviesRepository.find({ relations: ['sessions'] });
  }

  async findOne(id: number) {
    const movie = await this.moviesRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.findOne(id);

    let sessions = movie.sessions;
    let newSessions = updateMovieDto.sessions;
    if (newSessions) {
      await Promise.all(
        movie.sessions.map((movie) => {
          return this.sessionsService.remove(movie.id);
        }),
      );
      sessions = await Promise.all(
        updateMovieDto.sessions.map((sessionDto) =>
          this.sessionsService.create(sessionDto),
        ),
      );
    }

    movie.name = updateMovieDto.name || movie.name;
    movie.minimumAge = updateMovieDto.minimumAge || movie.minimumAge;
    movie.sessions = sessions;

    return await this.moviesRepository.save(movie);
  }

  async remove(id: number) {
    const movie = await this.findOne(id);
    return await this.moviesRepository.remove(movie);
  }
}
