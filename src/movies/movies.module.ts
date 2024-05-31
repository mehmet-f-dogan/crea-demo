import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { SessionsModule } from 'src/sessions/sessions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';

@Module({
  imports: [SessionsModule, TypeOrmModule.forFeature([Movie])],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
