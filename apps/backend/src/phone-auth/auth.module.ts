import { PhoneAccessStrategy } from '@/phone-auth/strategies/access.strategy';
import { UserModule } from '@/user/user.module';
import { parseEnv } from '@/utils/parseEnv';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneAuthController } from './auth.controller';
import { PhoneAuthService } from './auth.service';
import { AuthCode } from './entities/authCode.entity';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: parseEnv('ACCESS_TOKEN'),
      signOptions: { expiresIn: '15m' },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 5000,
          limit: 10,
        },
      ],
    }),
    PassportModule,
    TypeOrmModule.forFeature([AuthCode]),
  ],
  controllers: [PhoneAuthController],
  providers: [PhoneAuthService, PhoneAccessStrategy],
  exports: [PhoneAuthService],
})
export class PhoneAuthModule {}
