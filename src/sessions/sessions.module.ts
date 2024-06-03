import { Module, forwardRef } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { MoviesModule } from '../movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';

@Module({
  imports: [
    forwardRef(() => MoviesModule),
    TypeOrmModule.forFeature([Session]),
  ],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
