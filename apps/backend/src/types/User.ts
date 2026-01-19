import type { PasswordUser } from '@/user/entities/passwordUser.entity';
import type { PhoneUser } from '@/user/entities/phoneUser.entity';
import { type Auth } from './Auth';

export type User<T extends Auth = 'password'> = T extends 'password' ? PasswordUser : PhoneUser;

export type PublicUser<T extends Auth = 'password'> = T extends 'password'
  ? Pick<User, 'id' | 'username'>
  : Pick<User<'phone'>, 'id'> & { name: string };
