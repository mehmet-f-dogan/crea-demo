import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UsersService } from 'src/users/users.service';
import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {}

  create(createTicketDto: CreateTicketDto) {
    return 'This action adds a new ticket';
  }

  redeem(id: number) {
    return `This action returns all tickets`;
  }
}
