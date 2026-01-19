import { type UUID } from '@/types/UUID';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordUser } from './entities/passwordUser.entity';

@Injectable()
export class PasswordUserService {
  constructor(
    @InjectRepository(PasswordUser)
    private passwordUserRepo: Repository<PasswordUser>,
  ) {}

  async create(username: string, hashedPassword: string) {
    const user = this.passwordUserRepo.create({
      username: username,
      password: hashedPassword,
    });
    return await this.passwordUserRepo.save(user);
  }

  async findById(id: PasswordUser['id'], sensitive = false) {
    const user = await this.passwordUserRepo.findOne({
      where: { id },
      select: sensitive ? ['id', 'username', 'password', 'rtHash', 'isActive'] : undefined,
    });
    return user;
  }

  async findByName(username: PasswordUser['username'], sensitive = false) {
    const user = await this.passwordUserRepo.findOne({
      where: { username },
      select: sensitive ? ['id', 'username', 'password', 'rtHash', 'isActive'] : undefined,
    });
    return user;
  }

  async updateUser(userId: PasswordUser['id'], payload: Omit<Partial<PasswordUser>, 'id'>) {
    const user = await this.passwordUserRepo.update({ id: userId }, payload);
    return user;
  }

  async remove(id: UUID) {
    const user = await this.passwordUserRepo.delete({ id: id });
    return user;
  }
}
