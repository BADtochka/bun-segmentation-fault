import { SoftUser } from '@type/SoftUser.type'
import { User } from 'src/users/user.entity'

const getSoftUser = (user: User): SoftUser => {
  const { id, name } = user

  return {
    id,
    name,
  }
}

export default getSoftUser
