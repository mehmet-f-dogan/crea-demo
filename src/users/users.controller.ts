import {
  Controller,
  Get,
  Post,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('activate-mod')
  @ApiBearerAuth('access-token')
  toggleMod(@Request() req) {
    return this.usersService.activateMod(req.user.id);
  }

  @Get('history')
  @ApiBearerAuth('access-token')
  getHistory(@Request() req) {
    return this.usersService.getHistory(req.user.id);
  }
}
