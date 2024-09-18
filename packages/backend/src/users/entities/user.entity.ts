import { UUID } from '@type/UUID.type'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ nullable: true })
  rtHash: string

  @Column({ default: true })
  isActive: boolean
}
