import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { DB_CONFIG } from './constants/typeorm.config';
import { EnvModule } from './env/env.module';
import { PhoneAuthModule } from './phone-auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_CONFIG),
    EnvModule,
    ScheduleModule.forRoot(),
    // PasswordAuthModule,
    PhoneAuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
