import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/CreateUserDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authServices.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authServices.ValidateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return this.authServices.login(user);
  }
}
