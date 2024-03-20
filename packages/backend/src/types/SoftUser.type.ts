import { User } from 'src/users/user.entity'

export type SoftUser = Pick<User, 'id' | 'name'>
