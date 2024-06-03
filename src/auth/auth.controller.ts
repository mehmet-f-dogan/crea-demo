import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './auth.guard';
import { SignupDto } from './dto/signup.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  logIn(@Body() logInDto: LoginDto) {
    return this.authService.logIn(logInDto.username, logInDto.password);
  }

  @Post('signup')
  @Public()
  signUp(@Body() signInDto: SignupDto) {
    return this.authService.signUp(signInDto);
  }
}
