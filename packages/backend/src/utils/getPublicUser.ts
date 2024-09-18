import { PublicUser } from '@type/SoftUser.type'
import { User } from 'src/users/entities/user.entity'

const getPublicUser = (user: User): PublicUser => {
  const { id, username } = user

  return {
    id,
    username,
  }
}

export default getPublicUser
