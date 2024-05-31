import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { SessionsModule } from './sessions/sessions.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [UsersModule, MoviesModule, SessionsModule, TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
