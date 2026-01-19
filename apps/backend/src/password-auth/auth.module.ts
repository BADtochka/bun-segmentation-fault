import { UserModule } from '@/user/user.module';
import { parseEnv } from '@/utils/parseEnv';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordAuthController } from './auth.controller';
import { PasswordAuthService } from './auth.service';
import { PasswordAccessStrategy } from './strategies/access.strategy';
import { PasswordLocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: parseEnv('ACCESS_TOKEN'),
      signOptions: { expiresIn: '15m' },
    }),
    PassportModule,
  ],
  controllers: [PasswordAuthController],
  providers: [PasswordAuthService, PasswordLocalStrategy, PasswordAccessStrategy],
  exports: [PasswordAuthService],
})
export class PasswordAuthModule {}
