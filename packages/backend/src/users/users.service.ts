import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from '@type/uuid.type';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create() {
    return 'This action adds a new ';
  }

  findAll() {
    return `This action returns all s`;
  }

  async findOne(id: UUID) {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async update(payload: User) {
    const user = await this.usersRepository.update({ id: payload.id }, payload);
    return user;
  }

  async remove(id: UUID) {
    const user = await this.usersRepository.delete({ id });
    return user;
  }
}
