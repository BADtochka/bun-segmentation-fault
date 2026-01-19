import { isProd } from '@/constants/env';
import { Public } from '@/decorators/public.decorator';
import { AuthCookieInterceptor } from '@/main-auth/interceptors/authCookie.interceptor';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { type Request, type Response } from 'express';
import { PhoneAuthService } from './auth.service';
import { PreCodeDto } from './dto/preCode.dto';
import { VerifyCodeDto } from './dto/verifyCode.dto';

@Controller('auth')
export class PhoneAuthController {
  constructor(private authService: PhoneAuthService) {}

  @Public()
  @Post('signIn')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 2 } })
  async phoneLogin(@Body() { phoneNumber }: PreCodeDto, @Res() res: Response) {
    const { code } = await this.authService.generateAuthCode(phoneNumber);
    res.status(200);
    if (isProd) {
      res.send();
      return;
    }

    res.send({ code });
  }

  @Public()
  @Post('signIn/verify')
  @UseInterceptors(AuthCookieInterceptor)
  async verifyAuthCode(@Body() data: VerifyCodeDto) {
    return await this.authService.login(data);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.send();
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AuthCookieInterceptor)
  async refreshTokens(@Req() req: Request) {
    const user = await this.authService.refreshTokens(req.cookies.refreshToken);
    return user;
  }
}
