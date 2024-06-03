import { Module, forwardRef } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { SessionsModule } from '../sessions/sessions.module';
import { Ticket } from './entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => SessionsModule),
    UsersModule,
    TypeOrmModule.forFeature([Ticket]),
  ],
  exports: [TicketsService],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
