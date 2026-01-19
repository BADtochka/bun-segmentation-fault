import { isProd } from '@/constants/env';
import { type DecodedJwtToken } from '@/main-auth/types/jwt.type';
import { type PublicUser, type User } from '@/types/User';
import { PasswordUserService } from '@/user/passwordUser.service';
import getPublicUser from '@/utils/getPublicUser';
import { parseEnv } from '@/utils/parseEnv';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { differenceInSeconds, fromUnixTime } from 'date-fns';

@Injectable()
export class PasswordAuthService {
  public constructor(
    private userService: PasswordUserService,
    private jwtService: JwtService,
  ) {}

  async createAccessToken(user: PublicUser) {
    const payload = { name: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async createRefreshToken(user: PublicUser) {
    const payload = { name: user.username, sub: user.id };
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: parseEnv('REFRESH_TOKEN'),
    });
  }

  async validateUser(username: string, rawPassword: string) {
    const user = await this.userService.findByName(username, true);

    if (!user) return null;
    if (!user.isActive) {
      throw new UnauthorizedException('Ваша учётная запись отключена');
    }

    const isMatch = await compare(rawPassword, user.password);

    if (user && isMatch) {
      return getPublicUser(user);
    }

    return null;
  }

  async updateRefreshToken(userId: User['id'], refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, 10);
    await this.userService.updateUser(userId, { rtHash: hashedRefreshToken });
  }

  async decodeJwtToken(token: string): Promise<DecodedJwtToken> {
    const decoded = this.jwtService.decode<DecodedJwtToken>(token);
    return decoded;
  }

  async verifyRefreshToken(refreshToken: string) {
    const decodedRefreshToken = await this.decodeJwtToken(refreshToken);
    const isExpired = differenceInSeconds(fromUnixTime(decodedRefreshToken.exp), new Date()) < 0;

    if (!decodedRefreshToken || isExpired) return false;
    const user = await this.userService.findById(decodedRefreshToken.sub, true);

    if (!user || !user.rtHash) return false;
    return await compare(refreshToken, user.rtHash);
  }

  async refreshTokens(oldRefreshToken: string) {
    const decodedRefreshToken = await this.decodeJwtToken(oldRefreshToken);
    const isValid = await this.verifyRefreshToken(oldRefreshToken);

    if (!isValid || !decodedRefreshToken) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findById(decodedRefreshToken.sub);

    if (!user) {
      throw new NotFoundException();
    }

    const softUser = getPublicUser(user);
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    await this.updateRefreshToken(user.id, refreshToken);
    return { ...softUser, accessToken, refreshToken };
  }

  async passwordRegister(user: Pick<User, 'username' | 'password'>) {
    if (isProd) throw new NotFoundException();
    const hashedPassword = await hash(user.password, 10);
    const newUser = await this.userService.create(user.username, hashedPassword);

    return getPublicUser(newUser);
  }

  async passwordLogin(user: PublicUser) {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    await this.updateRefreshToken(user.id, refreshToken);
    return { ...user, accessToken, refreshToken };
  }

  async logout(userId: User['id']) {
    await this.userService.updateUser(userId, { rtHash: null });
  }
}
