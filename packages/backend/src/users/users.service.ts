import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UUID } from '@type/UUID.type'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(username: string, hashedPassword: string) {
    const alreadyExist = await this.usersRepository.findOne({
      where: { username: username },
    })

    if (alreadyExist) throw new ConflictException('User already exists')

    const user = this.usersRepository.create({
      username: username,
      password: hashedPassword,
    })
    return await this.usersRepository.save(user)
  }

  findAll() {
    return `This action returns all s`
  }

  // TODO: edit
  async findOne(queryUser: Partial<User>) {
    if (queryUser.id) {
      const user = await this.usersRepository.findOne({ where: { id: queryUser.id } })
      return user
    }

    const user = await this.usersRepository.findOne({
      where: { username: queryUser.username },
    })
    return user
  }

  async updateUser(userId: User['id'], payload: Omit<Partial<User>, 'id'>) {
    const user = await this.usersRepository.update({ id: userId }, payload)
    return user
  }

  async remove(id: UUID) {
    const user = await this.usersRepository.delete({ id: id })
    return user
  }
}
