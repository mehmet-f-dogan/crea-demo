import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Session } from '../sessions/entities/session.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory:
        process.env.NODE_ENV === 'test'
          ? () => ({
              type: 'sqlite',
              database: ':memory:',
              dropSchema: true,
              entities: [],
              synchronize: true,
              autoLoadEntities: true,
            })
          : async (configService: ConfigService) => {
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
                ssl: true,
                synchronize: true,
              };
            },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
