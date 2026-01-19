import { PasswordUser } from '@/user/entities/passwordUser.entity';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { LocalAuthGuard } from '../main-auth/guards/local.guard';
import { AuthCookieInterceptor } from '../main-auth/interceptors/authCookie.interceptor';
import { PasswordAuthService } from './auth.service';

@Controller('auth')
export class PasswordAuthController {
  constructor(private authService: PasswordAuthService) {}

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(AuthCookieInterceptor)
  @Post('signIn')
  async passwordLogin(@Req() req: Request) {
    return await this.authService.passwordLogin(req.user as PasswordUser);
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
