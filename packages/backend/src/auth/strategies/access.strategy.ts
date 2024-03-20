import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import getRequestCookie from '@utils/getRequestCookie'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from '../constants'

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'accessToken') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => getRequestCookie(req, 'accessToken')]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessToken,
    })
  }

  async validate(payload: any) {
    return { id: payload.sub, name: payload.name }
  }
}
