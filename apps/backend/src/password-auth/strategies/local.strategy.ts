import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PasswordAuthService } from '../auth.service';

@Injectable()
export class PasswordLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: PasswordAuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const softUser = await this.authService.validateUser(username, password);

    if (softUser) return softUser;

    const createdUser = await this.authService.passwordRegister({ username, password });
    return createdUser;
  }
}
