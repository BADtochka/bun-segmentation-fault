import { type UUID } from '@/types/UUID';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PhoneUser {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  rtHash: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isRegistered: boolean;
}
