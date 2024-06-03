import { Module, forwardRef } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { SessionsModule } from '../sessions/sessions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';

@Module({
  imports: [
    forwardRef(() => SessionsModule),
    TypeOrmModule.forFeature([Movie]),
  ],
  exports: [MoviesService],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
