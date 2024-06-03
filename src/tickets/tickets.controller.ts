import {
  Controller,
  Post,
  Body,
  Param,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('tickets')
@ApiTags('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    return this.ticketsService.create(createTicketDto, req.user.id);
  }

  @Post('redeem/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  redeem(@Param('id') id: number, @Request() req) {
    return this.ticketsService.redeem(id, req.user.id);
  }
}
