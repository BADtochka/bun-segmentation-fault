import { Controller, Get, Req } from '@nestjs/common';
import { type Request } from 'express';

@Controller('user')
export class UserController {
  public constructor() {}

  @Get('profile')
  async profile(@Req() req: Request) {
    return req.user;
  }
}
