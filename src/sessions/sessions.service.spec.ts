import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SessionsService } from './sessions.service';

import { Session, TimeSlot } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { MoviesService } from '../movies/movies.service';

describe('SessionsService', () => {
  let service: SessionsService;
  let sessionsRepository: Repository<Session>;
  let moviesService: MoviesService;

  const mockSessionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockMoviesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getRepositoryToken(Session),
          useValue: mockSessionRepository,
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    sessionsRepository = module.get<Repository<Session>>(
      getRepositoryToken(Session),
    );
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new session', async () => {
      const createSessionDto: CreateSessionDto = {
        date: '31.12.2024',
        movieId: 1,
        roomNumber: 1,
        timeSlot: TimeSlot.SLOT_14,
      };
      const movie = { id: 1, title: 'Test Movie' };
      const session = { id: 1, ...createSessionDto, movie, tickets: [] };

      mockMoviesService.findOne.mockResolvedValue(movie);
      mockSessionRepository.findOneBy.mockResolvedValue(null);
      mockSessionRepository.create.mockReturnValue(session);
      mockSessionRepository.save.mockResolvedValue(session);

      const result = await service.create(createSessionDto);
      expect(result).toEqual(session);
      expect(moviesService.findOne).toHaveBeenCalledWith(
        createSessionDto.movieId,
        [],
      );
      expect(sessionsRepository.findOneBy).toHaveBeenCalledWith({
        date: createSessionDto.date,
        roomNumber: createSessionDto.roomNumber,
        timeSlot: createSessionDto.timeSlot,
      });
      expect(sessionsRepository.create).toHaveBeenCalledWith({
        date: createSessionDto.date,
        movie: movie,
        roomNumber: createSessionDto.roomNumber,
        timeSlot: createSessionDto.timeSlot,
        tickets: [],
      });
      expect(sessionsRepository.save).toHaveBeenCalledWith(session);
    });

    it('should throw a BadRequestException if session exists', async () => {
      const createSessionDto: CreateSessionDto = {
        date: '31.12.2024',
        movieId: 1,
        roomNumber: 1,
        timeSlot: TimeSlot.SLOT_14,
      };
      const existingSession = { id: 1, ...createSessionDto, tickets: [] };

      mockSessionRepository.findOneBy.mockResolvedValue(existingSession);

      await expect(service.create(createSessionDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(sessionsRepository.findOneBy).toHaveBeenCalledWith({
        date: createSessionDto.date,
        roomNumber: createSessionDto.roomNumber,
        timeSlot: createSessionDto.timeSlot,
      });
    });
  });

  describe('findOne', () => {
    it('should find and return a session', async () => {
      const session = {
        id: 1,
        date: new Date(),
        roomNumber: 1,
        timeSlot: '14:00-16:00',
        tickets: [],
      };
      mockSessionRepository.findOne.mockResolvedValue(session);

      const result = await service.findOne(1, []);
      expect(result).toEqual(session);
      expect(sessionsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });
    });

    it('should throw a NotFoundException if session not found', async () => {
      mockSessionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1, [])).rejects.toThrow(NotFoundException);
      expect(sessionsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });
    });
  });

  describe('remove', () => {
    it('should remove a session', async () => {
      const session = {
        id: 1,
        date: new Date(),
        roomNumber: 1,
        timeSlot: '14:00-16:00',
        tickets: [],
      };
      mockSessionRepository.findOne.mockResolvedValue(session);
      mockSessionRepository.remove.mockResolvedValue(session);

      const result = await service.remove(1);
      expect(result).toEqual(session);
      expect(sessionsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });
      expect(sessionsRepository.remove).toHaveBeenCalledWith(session);
    });
  });
});
