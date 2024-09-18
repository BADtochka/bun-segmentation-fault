import { isProd } from '@constants/env'
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request, Response } from 'express'
import { User } from 'src/users/entities/user.entity'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.register(req.body as User)
    return res.send(user)
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.login(req.user as User)

    res.cookie('accessToken', user.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProd,
    })

    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProd,
    })

    return res.send(user)
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    return res.send()
  }

  @Get('profile')
  @UseGuards(AuthGuard('accessToken'))
  async profile(@Req() req: Request) {
    return req.user
  }

  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.refreshTokens(req.cookies.refreshToken)

    res.cookie('accessToken', user.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProd,
    })

    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProd,
    })

    return res.send(user)
  }
}
