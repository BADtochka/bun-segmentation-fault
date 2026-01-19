import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordUser } from './entities/passwordUser.entity';
import { PhoneUser } from './entities/phoneUser.entity';
import { PasswordUserService } from './passwordUser.service';
import { PhoneUserService } from './phoneUser.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordUser, PhoneUser])],
  controllers: [UserController],
  providers: [PasswordUserService, PhoneUserService],
  exports: [PasswordUserService, PhoneUserService],
})
export class UserModule {}
