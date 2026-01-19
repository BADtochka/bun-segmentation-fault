import { type DecodedJwtToken } from '@/main-auth/types/jwt.type';
import { type User } from '@/types/User';
import { PhoneUserService } from '@/user/phoneUser.service';
import { anonimizeName } from '@/utils/anonimizeName';
import getPublicUser from '@/utils/getPublicUser';
import { parseEnv } from '@/utils/parseEnv';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { differenceInSeconds, fromUnixTime } from 'date-fns';
import { Repository } from 'typeorm';
import { VerifyCodeDto } from './dto/verifyCode.dto';
import { AuthCode } from './entities/authCode.entity';

@Injectable()
export class PhoneAuthService {
  public constructor(
    private userService: PhoneUserService,
    private jwtService: JwtService,
    @InjectRepository(AuthCode) private tempCodeRepo: Repository<AuthCode>,
  ) {}

  async createAccessToken(user: User<'phone'>) {
    const payload = { name: anonimizeName(user.firstName, user.lastName), sub: user.id };
    return this.jwtService.sign(payload);
  }

  async createRefreshToken(user: User<'phone'>) {
    const payload = { name: anonimizeName(user.firstName, user.lastName), sub: user.id };
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: parseEnv('REFRESH_TOKEN'),
    });
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

    const user = await this.userService.findById(decodedRefreshToken.sub, { rtHash: true });

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

    const softUser = getPublicUser<'phone'>(user);
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    await this.updateRefreshToken(user.id, refreshToken);
    return { ...softUser, accessToken, refreshToken };
  }

  async generateAuthCode(phoneNumber: string) {
    const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);

    // TODO: add SMS sending logic

    return await this.tempCodeRepo.save({ phoneNumber, code: String(code) });
  }

  async login(data: VerifyCodeDto) {
    const user = await this.userService.findOrCreate(data);
    await this.verifyAuthCode(data);

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    await this.updateRefreshToken(user.id, refreshToken);
    const softUser = getPublicUser<'phone'>(user);
    return { ...softUser, accessToken, refreshToken };
  }

  private async verifyAuthCode({ phoneNumber, code }: Pick<VerifyCodeDto, 'phoneNumber' | 'code'>) {
    const tempCode = await this.tempCodeRepo.findOne({ where: { phoneNumber } });
    if (!tempCode || tempCode.code !== code) throw new BadRequestException('Неправильный код');

    await this.tempCodeRepo.remove(tempCode);
    return true;
  }

  async logout(userId: User<'phone'>['id']) {
    await this.userService.updateUser(userId, { rtHash: null });
  }
}
