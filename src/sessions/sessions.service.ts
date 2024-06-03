import {
  Injectable,
  forwardRef,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    @Inject(forwardRef(() => MoviesService))
    private readonly moviesService: MoviesService,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const movie = await this.moviesService.findOne(
      createSessionDto.movieId,
      [],
    );

    const existingSession = await this.sessionsRepository.findOneBy({
      date: createSessionDto.date,
      roomNumber: createSessionDto.roomNumber,
      timeSlot: createSessionDto.timeSlot,
    });

    if (existingSession) {
      throw new BadRequestException(
        'Another session is registered for the same timeslot and room',
      );
    }

    const session = this.sessionsRepository.create({
      date: createSessionDto.date,
      movie: movie,
      roomNumber: createSessionDto.roomNumber,
      timeSlot: createSessionDto.timeSlot,
      tickets: [],
    });

    return await this.sessionsRepository.save(session);
  }

  async findOne(id: number, relations: string[]) {
    const sessions = await this.sessionsRepository.findOne({
      where: { id },
      relations,
    });
    if (!sessions) {
      throw new NotFoundException(`Session not found with id: ${id}`);
    }
    return sessions;
  }

  async remove(id: number) {
    try {
      const session = await this.findOne(id, []);
      return await this.sessionsRepository.remove(session);
    } catch (ignored) {}
  }
}
