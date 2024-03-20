import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UUID } from '@type/uuid.type'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(username: UUID, hashedPassword: string) {
    const user = this.usersRepository.create({
      name: username,
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
      where: { name: queryUser.name },
    })
    return user
  }

  async updateUser(userId: User['id'], payload: Omit<Partial<User>, 'id'>) {
    const user = await this.usersRepository.update({ id: userId }, payload)
    return user
  }

  async remove(id: UUID) {
    const user = await this.usersRepository.delete({ id })
    return user
  }
}
