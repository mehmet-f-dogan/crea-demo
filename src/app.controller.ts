import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @HttpCode(HttpStatus.OK)
  @Get('activate-mod')
  @Public()
  toggleMod() {
    return 'Welcome to my Crea Demo API!';
  }
}
