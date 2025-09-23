import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/zod.pipe';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterDto))
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.role);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginDto))
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
}
