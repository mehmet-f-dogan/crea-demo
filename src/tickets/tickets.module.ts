import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { SessionsModule } from 'src/sessions/sessions.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SessionsModule, UsersModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
