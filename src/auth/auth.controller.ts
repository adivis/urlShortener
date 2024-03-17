import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) signUpDto: SignUpDto,
  ): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Get('/login')
  login(@Body(ValidationPipe) loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
