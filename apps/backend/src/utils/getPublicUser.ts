import { type Auth } from '@/types/Auth';
import { type PublicUser, type User } from '@/types/User';
import type { PasswordUser } from '@/user/entities/passwordUser.entity';
import type { PhoneUser } from '@/user/entities/phoneUser.entity';
import { anonimizeName } from './anonimizeName';

// Type guards
const isPasswordUser = (user: any): user is PasswordUser => {
  return 'username' in user;
};

const isPhoneUser = (user: any): user is PhoneUser => {
  return 'phoneNumber' in user;
};

const getPublicUser = <T extends Auth = 'password'>(user: User<T>): PublicUser<T> => {
  if (isPasswordUser(user)) {
    return {
      id: user.id,
      username: user.username,
    } as PublicUser<T>;
  }

  if (isPhoneUser(user)) {
    return {
      id: user.id,
      name: anonimizeName(user.firstName, user.lastName),
    } as PublicUser<T>;
  }

  return {} as PublicUser<T>;
};

export default getPublicUser;
