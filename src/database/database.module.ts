import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Session } from 'src/sessions/entities/session.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('DATABASE_HOST');
        const port = configService.get<number>('DATABASE_PORT');
        const username = configService.get<string>('DATABASE_USERNAME');
        const password = configService.get<string>('DATABASE_PASSWORD');
        const database = configService.get<string>('DATABASE_NAME');

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [User, Ticket, Session, Movie],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
