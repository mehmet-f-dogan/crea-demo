import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  @Public()
  greet() {
    return `<h1>Crea Demo API<h1>`;
  }
}
