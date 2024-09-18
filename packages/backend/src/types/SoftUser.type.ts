import { User } from 'src/users/entities/user.entity'

export type PublicUser = Pick<User, 'id' | 'username'>
