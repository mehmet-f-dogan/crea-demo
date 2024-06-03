import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { MoviesService } from './movies.service';
import { SessionsService } from '../sessions/sessions.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { CreateMovieBulkDto } from './dto/create-movie-bulk.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TimeSlot } from '../sessions/entities/session.entity';

describe('MoviesService', () => {
  let service: MoviesService;
  let moviesRepository: Repository<Movie>;
  let sessionsService: SessionsService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  const mockMovieRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    remove: jest.fn(),
  };

  const mockSessionsService = {
    create: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: { save: jest.fn() },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
        {
          provide: SessionsService,
          useValue: mockSessionsService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    moviesRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    sessionsService = module.get<SessionsService>(SessionsService);
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie and its sessions', async () => {
      const createMovieDto: CreateMovieDto = {
        name: 'Test Movie',
        minimumAge: 12,
        sessions: [
          {
            date: '31.12.2024',
            roomNumber: 1,
            timeSlot: TimeSlot.SLOT_14,
            movieId: 1,
          },
        ],
      };
      const movie = { id: 1, ...createMovieDto, sessions: [] };

      mockMovieRepository.create.mockReturnValue(movie);
      mockMovieRepository.save.mockResolvedValue(movie);
      mockSessionsService.create.mockResolvedValue({
        id: 1,
        ...createMovieDto.sessions[0],
        movieId: movie.id,
      });

      const result = await service.create(createMovieDto);
      expect(result).toEqual(movie);
      expect(moviesRepository.create).toHaveBeenCalledWith({
        minimumAge: createMovieDto.minimumAge,
        name: createMovieDto.name,
        sessions: [],
      });
      expect(moviesRepository.save).toHaveBeenCalled();
      expect(sessionsService.create).toHaveBeenCalledWith({
        ...createMovieDto.sessions[0],
        movieId: movie.id,
      });
    });
  });

  describe('createBulk', () => {
    it('should create multiple movies and their sessions', async () => {
      const createMovieBulkDto: CreateMovieBulkDto = {
        movies: [
          {
            name: 'Movie 1',
            minimumAge: 12,
            sessions: [
              {
                date: '31.12.2024',
                roomNumber: 1,
                timeSlot: TimeSlot.SLOT_14,
                movieId: 1,
              },
            ],
          },
          {
            name: 'Movie 2',
            minimumAge: 15,
            sessions: [
              {
                date: '31.12.2024',
                roomNumber: 2,
                timeSlot: TimeSlot.SLOT_16,
                movieId: 1,
              },
            ],
          },
        ],
      };
      const movie1 = { id: 1, ...createMovieBulkDto.movies[0], sessions: [] };
      const movie2 = { id: 2, ...createMovieBulkDto.movies[1], sessions: [] };

      mockMovieRepository.create
        .mockReturnValueOnce(movie1)
        .mockReturnValueOnce(movie2);
      mockMovieRepository.save
        .mockResolvedValueOnce(movie1)
        .mockResolvedValueOnce(movie2);
      mockSessionsService.create.mockResolvedValueOnce({
        id: 1,
        ...createMovieBulkDto.movies[0].sessions[0],
        movieId: movie1.id,
      });
      mockSessionsService.create.mockResolvedValueOnce({
        id: 2,
        ...createMovieBulkDto.movies[1].sessions[0],
        movieId: movie2.id,
      });

      const result = await service.createBulk(createMovieBulkDto);
      expect(result).toEqual([movie1, movie2]);
    });
  });

  describe('findOne', () => {
    it('should find and return a movie', async () => {
      const movie = { id: 1, name: 'Test Movie', minimumAge: 12, sessions: [] };
      mockMovieRepository.findOne.mockResolvedValue(movie);

      const result = await service.findOne(1, []);
      expect(result).toEqual(movie);
      expect(moviesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });
    });

    it('should throw a NotFoundException if movie not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1, [])).rejects.toThrow(NotFoundException);
      expect(moviesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });
    });
  });

  describe('update', () => {
    it('should update and return the movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        name: 'Updated Movie',
        minimumAge: 15,
      };
      const movie = { id: 1, name: 'Test Movie', minimumAge: 12, sessions: [] };

      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockMovieRepository.save.mockResolvedValue({
        ...movie,
        ...updateMovieDto,
      });

      const result = await service.update(1, updateMovieDto);
      expect(result).toEqual({ ...movie, ...updateMovieDto });
      expect(moviesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });
      expect(moviesRepository.save).toHaveBeenCalledWith({
        ...movie,
        ...updateMovieDto,
      });
    });
  });
});
