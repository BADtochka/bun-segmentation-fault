import { UUID } from '@type/uuid.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  rtHash: string;

  @Column({ default: true })
  isActive: boolean;
}
