import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import getRequestCookie from '@utils/getRequestCookie'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from 'src/users/users.service'
import { jwtConstants } from '../constants'
import { DecodedJwtToken } from '../types/jwt.type'

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'accessToken') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => getRequestCookie(req, 'accessToken')]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessToken,
    })
  }

  async validate(payload: DecodedJwtToken) {
    const user = await this.userService.findOne({ id: payload.sub })

    if (!user || !user.isActive) throw new UnauthorizedException()

    return { id: payload.sub, username: payload.name }
  }
}
