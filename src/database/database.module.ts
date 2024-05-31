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
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Ticket, Movie, Session],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
