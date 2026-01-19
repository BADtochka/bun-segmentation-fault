import { type DecodedJwtToken } from '@/main-auth/types/jwt.type';
import { PasswordUserService } from '@/user/passwordUser.service';
import getRequestCookie from '@/utils/getRequestCookie';
import { parseEnv } from '@/utils/parseEnv';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { type Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class PasswordAccessStrategy extends PassportStrategy(Strategy, 'accessToken') {
  constructor(private userService: PasswordUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => getRequestCookie(req, 'accessToken'),
      ]),
      ignoreExpiration: true,
      secretOrKey: parseEnv('ACCESS_TOKEN'),
    });
  }

  async validate(payload: DecodedJwtToken) {
    const user = await this.userService.findById(payload.sub);

    if (!user || !user.isActive) throw new UnauthorizedException();

    return { id: payload.sub, username: payload.name };
  }
}
