import { type UUID } from '@/types/UUID';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsSelect, type Repository } from 'typeorm';
import { PhoneUser } from './entities/phoneUser.entity';

@Injectable()
export class PhoneUserService {
  constructor(
    @InjectRepository(PhoneUser)
    private phoneUserRepo: Repository<PhoneUser>,
  ) {}

  async findOrCreate(data: Pick<PhoneUser, 'phoneNumber' | 'firstName' | 'lastName'>) {
    const existedUser = await this.findByPhone(data.phoneNumber);
    if (existedUser) return existedUser;

    const user = this.phoneUserRepo.create({ ...data, isRegistered: true });
    return await this.phoneUserRepo.save(user);
  }

  async findById(id: PhoneUser['id'], select?: FindOptionsSelect<PhoneUser>) {
    const user = await this.phoneUserRepo.findOne({
      where: { id },
      select,
    });

    return user;
  }

  async findByPhone(phoneNumber: PhoneUser['phoneNumber'], select?: FindOptionsSelect<PhoneUser>) {
    const user = await this.phoneUserRepo.findOne({
      where: { phoneNumber },
      select,
    });
    return user;
  }

  async updateUser(userId: PhoneUser['id'], payload: Omit<Partial<PhoneUser>, 'id'>) {
    const user = await this.phoneUserRepo.update({ id: userId }, payload);
    return user;
  }

  async remove(id: UUID) {
    const user = await this.phoneUserRepo.delete({ id: id });
    return user;
  }
}
