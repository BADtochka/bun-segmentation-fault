import { isProd } from '@constants/env'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import getPublicUser from '@utils/getPublicUser'
import { compare, hash } from 'bcrypt'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { jwtConstants } from './constants'
import { DecodedJwtToken } from './types/jwt.type'

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccessToken(user: Omit<User, 'password'>) {
    const payload = { name: user.username, sub: user.id }
    return this.jwtService.sign(payload)
  }

  async createRefreshToken(user: Omit<User, 'password'>) {
    const payload = { name: user.username, sub: user.id }
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: jwtConstants.refreshToken,
    })
  }

  async validateUser(username: string, rawPassword: string) {
    const user = await this.userService.findOne({ username: username })

    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль')
    } else if (!user.isActive) {
      throw new UnauthorizedException('Ваша учётная запись отключена')
    }

    const isMatch = await compare(rawPassword, user.password)

    if (user && isMatch) {
      return getPublicUser(user)
    }

    return null
  }

  async updateRefreshToken(userId: User['id'], refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, 10)
    await this.userService.updateUser(userId, { rtHash: hashedRefreshToken })
  }

  async decodeJwtToken(token: string): Promise<DecodedJwtToken | null> {
    const decoded = this.jwtService.decode<DecodedJwtToken>(token)
    return decoded
  }

  async verifyRefreshToken(refreshToken: string) {
    const decodedRefreshToken = await this.decodeJwtToken(refreshToken)
    if (!decodedRefreshToken) return false
    const user = await this.userService.findOne({ id: decodedRefreshToken.sub })
    if (!user.rtHash) return false
    return await compare(refreshToken, user.rtHash)
  }

  async logout(userId: User['id']) {
    await this.userService.updateUser(userId, { rtHash: null })
  }

  async refreshTokens(oldRefreshToken: string) {
    const decodedRefreshToken = await this.decodeJwtToken(oldRefreshToken)
    const isValid = await this.verifyRefreshToken(oldRefreshToken)
    if (!isValid || !decodedRefreshToken) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.findOne({ id: decodedRefreshToken.sub })
    const softUser = getPublicUser(user)
    const accessToken = await this.createAccessToken(user)
    const refreshToken = await this.createRefreshToken(user)
    await this.updateRefreshToken(user.id, refreshToken)
    return { ...softUser, accessToken, refreshToken }
  }

  async register(user: Pick<User, 'username' | 'password'>) {
    if (isProd) throw new NotFoundException()
    const hashedPassword = await hash(user.password, 10)
    const newUser = await this.userService.create(user.username, hashedPassword)
    return getPublicUser(newUser)
  }

  async login(user: Omit<User, 'password'>) {
    const accessToken = await this.createAccessToken(user)
    const refreshToken = await this.createRefreshToken(user)
    await this.updateRefreshToken(user.id, refreshToken)
    return { ...user, accessToken, refreshToken }
  }
}
