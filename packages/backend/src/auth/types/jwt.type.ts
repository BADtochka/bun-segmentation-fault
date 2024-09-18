import { User } from 'src/users/entities/user.entity'

export type DecodedJwtToken = {
  name: string
  sub: User['id']
  iat: number
  exp: number
}
