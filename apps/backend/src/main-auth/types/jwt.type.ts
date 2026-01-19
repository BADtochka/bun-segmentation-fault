import { type User } from '@/types/User';

export type DecodedJwtToken = {
  name: string;
  sub: User['id'];
  iat: number;
  exp: number;
};
