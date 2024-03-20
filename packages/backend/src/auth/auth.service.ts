import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import getSoftUser from '@utils/getSoftUser'
import { compare, hash } from 'bcrypt'
import { User } from 'src/users/user.entity'
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
    const payload = { name: user.name, sub: user.id }
    return this.jwtService.sign(payload)
  }

  async createRefreshToken(user: Omit<User, 'password'>) {
    const payload = { name: user.name, sub: user.id }
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: jwtConstants.refreshToken,
    })
  }

  async validateUser(username: string, rawPassword: string) {
    const user = await this.userService.findOne({ name: username })
    const isMatch = await compare(rawPassword, user.password)

    if (!user.isActive) {
      throw new UnauthorizedException('Ваша учётная запись отключена')
    }

    if (user && isMatch) {
      return getSoftUser(user)
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
    const softUser = getSoftUser(user)
    const accessToken = await this.createAccessToken(user)
    const refreshToken = await this.createRefreshToken(user)
    await this.updateRefreshToken(user.id, refreshToken)
    return { ...softUser, accessToken, refreshToken }
  }

  async login(user: Omit<User, 'password'>) {
    const accessToken = await this.createAccessToken(user)
    const refreshToken = await this.createRefreshToken(user)
    await this.updateRefreshToken(user.id, refreshToken)
    return { ...user, accessToken, refreshToken }
  }
}
