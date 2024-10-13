import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async ValidateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: any) {
    const hashedPassowrd = await bcrypt.hash(userDto.password, 10);
    const user = await this.userService.create({
      ...userDto,
      password: hashedPassowrd,
    });
    const payload: JwtPayload = { email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
