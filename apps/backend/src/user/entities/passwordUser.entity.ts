import { type UUID } from '@/types/UUID';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PasswordUser {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  rtHash: string | null;

  @Column({ default: true })
  isActive: boolean;
}
