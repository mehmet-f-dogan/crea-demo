import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { SessionsModule } from './sessions/sessions.module';
import { TicketsModule } from './tickets/tickets.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
@Module({
  imports: [
    ConfigModule,
    UsersModule,
    MoviesModule,
    SessionsModule,
    TicketsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
