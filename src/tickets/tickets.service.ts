import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { SessionsService } from '../sessions/sessions.service';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketResponseDto } from './dto/create-ticket-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    @Inject(forwardRef(() => SessionsService))
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto, userId: number) {
    const session = await this.sessionsService.findOne(
      createTicketDto.sessionId,
      ['movie'],
    );

    const user = await this.usersService.findOne(userId, []);
    if (user.age < session.movie.minimumAge) {
      throw new UnauthorizedException('Customer is too young');
    }

    const ticket = this.ticketsRepository.create({
      session: session,
      user: user,
    });

    await this.ticketsRepository.save(ticket);
    return { ticketId: ticket.id } as CreateTicketResponseDto;
  }

  async redeem(id: number, userId: number) {
    const ticket = await this.findOne(id);
    if (ticket.user.id != userId) {
      throw new UnauthorizedException();
    }
    ticket.isRedeemed = true;
    await this.ticketsRepository.save(ticket);
  }

  async findOne(id: number) {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket not found with id ${id}`);
    }
    return ticket;
  }

  async remove(id: number) {
    try {
      const ticket = await this.findOne(id);
      await this.ticketsRepository.remove(ticket);
    } catch (ignored) {}
  }
}
